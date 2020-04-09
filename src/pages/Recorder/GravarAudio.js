import React from 'react';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import Breadcrums from '@trendmicro/react-breadcrumbs';
import ensureArray from 'ensure-array';
import styled from 'styled-components';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '../app/StyledSideNav';
import { Link, withRouter } from 'react-router-dom';
import MicRecorder from 'mic-recorder-to-mp3';
import './styleAudio.css';
import {Progress} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const navWidthCollapsed = 64;
const navWidthExpanded = 280;

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const blobURL = "";

const NavHeader = styled.div`
    display: ${props => (props.expanded ? 'block' : 'none')};
    white-space: nowrap;
    background-color: #db3d44;
    color: #fff;

    > * {
        color: inherit;
        background-color: inherit;
    }

`;

const NavTitle = styled.div`
    font-size: 1em;
    line-height: 20px;
    padding-bottom: 4px;
`;

const NavSubTitle = styled.div`
    font-size: 1em;
    line-heigth: 20px;
    padding-bottom: 4px;
`;

const NavInfoPane = styled.div`
    float:left;
    width: 100%;
    padding: 10px 20px;
    bacground-color: #eee;
`;

const Separator = styled.div`
    clear:both;
    position:relative;
    margin: .8rem 0;
    background-color: #ddd;
    height: 1px;
`;

const Main = styled.main`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: ${navWidthCollapsed}px;
    overflow: hidden;
    transition: all .15s;
    padding: 0 20px;
    background: ${props => (props.expanded ? 'rgba(0, 0, 0, .6)' : 'inherit')};
    transition: background-color .35s cubic-bezier(.4, 0, .2, 1);
`;

class GravarAudio extends React.Component {
    constructor(props) {
        super(props);
    this.state = {
        selected: 'home',
        expanded: false,
        blobURL:'',
        isRecording: false,
        isBlocked: false,
        selectedFile: null,
        loaded:0
    }
}

    componentDidMount () {
        navigator.mediaDevices.getUserMedia({ audio: true},
            () => {
                console.log('Permission Granted');
                this.setState({ isBlocked: false});
            },
            () => {
                console.log('Permission Denied');
                this.setState({ isBlocked: true })
            },
        )
    }

    start = () => {
        if (this.state.isBlocked) {
            console.log('Permisson Deined');
        } else {
            Mp3Recorder.start().then(() => {
                this.setState({ isRecording: true });
            }).catch((e) => console.log(e));
        }
    };

    stop = () => {
        Mp3Recorder.stop().getMp3().then(([buffer, blob]) => {
            blobURL = URL.createObjectURL(blob)
            this.setState({ blobURL, isRecording: false });
        }).catch((e) => console.log(e));
    };

    lastUpdateTime = new Date().toISOString();

    gravarAudio(){
        this.props.history.push("/GravarAudio");
    }

    gravarVideo(){
        this.props.history.push("/GravarVideo");
    }

    home(){
        this.props.history.push("/App");

    }

    onSelect = (selected) => {
        this.setState({ selected : selected });
        if(selected == "home"){
            this.home();
        }  
        if(selected == "Gravar Audio"){
            this.gravarAudio();
        } 
        if(selected == "Gravar Video"){
            this.gravarVideo();
        } 
    };

    onToggle = (expanded) => {
        this.setState({ expanded: expanded });
    };

    pageTitle = {
        'Home' : 'Home',
        //'Gravar Audio' : ['Gravar Audio'],
        //'Gravar Video' : ['Gravar Video']

    }

    renderBreadcrumbs () {
        const { selected } = this.state;
        const list = ensureArray(this.pageTitle[selected]);

        return (
            <Breadcrums>
                {list.map((item, index) => (
                    <Breadcrums.Item 
                    active={index === list.length -1}
                    key={`${selected}_${index}`}
                    >
                        {item}
                    </Breadcrums.Item>
                ))}
            </Breadcrums>
        );
    }

    checkMimeType=(event)=>{
        //getting file object
        let files = event.target.files 
        //define message container
        let err = []
        // list allow mime type
       const types = ['image/png', 'image/jpeg', 'image/gif', 'multipar/form-data', 'video/mp4', 'video/3gpp']
        // loop access array
        for(var x = 0; x<files.length; x++) {
         // compare file type find doesn't matach
             if (types.every(type => files[x].type !== type)) {
             // create error message and assign to container   
             err[x] = files[x].type+' is not a supported format\n';
           }
         };
         for(var z = 0; z<err.length; z++) {// if message not same old that mean has error 
             // discard selected file
            toast.error(err[z])
            event.target.value = null
        }
       return true;
      }
      maxSelectFile=(event)=>{
        let files = event.target.files
            if (files.length > 3) { 
               const msg = 'Only 3 images can be uploaded at a time'
               event.target.value = null
               toast.warn(msg)
               return false;
          }
        return true;
     }
     checkFileSize=(event)=>{
      let files = event.target.files
      let size = 2000000 
      let err = []; 
      for(var x = 0; x<files.length; x++) {
      if (files[x].size > size) {
       err[x] = files[x].type+'is too large, please pick a smaller file\n';
     }
    };
    for(var z = 0; z<err.length; z++) {// if message not same old that mean has error 
      // discard selected file
     toast.error(err[z])
     event.target.value = null
    }
    return true;
    }
    onChangeHandler=event=>{
      var files = event.target.files
      if(this.maxSelectFile(event) && this.checkMimeType(event) &&    this.checkFileSize(event)){ 
      // if return true allow to setState
         this.setState({
         selectedFile: files,
         loaded:0
      })
    }
    }
      onClickHandler = () => {
        const data = new FormData() 
        for(var x = 0; x<this.state.selectedFile.length; x++) {
          data.append('file', this.state.selectedFile[x])
        }
        axios.post("http://localhost:4004/", data, {
          onUploadProgress: ProgressEvent => {
            this.setState({
              loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
            })
          },
        })
          .then(res => { // then print response status
            toast.success('upload success')
          })
          .catch(err => { // then print response status
            toast.error('upload fail')
          })
        }



    render() {
        const { expanded, selected } = this.state;

        return(
            <div >
            <SideNav
                style={{ minWidth: expanded ? navWidthExpanded : navWidthCollapsed }}
                onSelect={this.onSelect}
                onToggle={this.onToggle}
            >
                <Toggle />
                <NavHeader expanded={expanded}>
                    <NavTitle>Side Navigator</NavTitle>
                    <NavSubTitle>Styled Side Navigation</NavSubTitle>
                </NavHeader>
                {expanded &&
                    <NavInfoPane>
                        <div>Time: {this.lastUpdateTime}</div>
                        <div>User: Admin</div>
                    </NavInfoPane>
                }
                <Nav
                    defaultSelected={selected}
                >
                    <NavItem eventKey="home"> 
                        <NavIcon>
                            <i className="fa fa-fw fa-home" styled={{ fontSize: '1.75em', verticalAlign: 'middle' }} />
                        </NavIcon>
                        <NavText styled={{ paddingRight: 32 }} title="HOME">
                            HOME
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="Gravar Audio">
                        <NavIcon>
                            <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em', verticalAlign: 'middle'}}/>
                        </NavIcon>
                        <NavText style={{ paddingRight: 32}} title="Gravar Audio">
                           GRAVAR AUDIO
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="Gravar Video">
                        <NavIcon>
                            <i className="fa fa-fw fa-list-alt" style={{ fontSize: '1.75em', verticalAlign: 'middle' }}/>
                        </NavIcon>
                        <NavText style={{ paddingRight: 32}} title="Gravar Video">
                            GRAVAR VIDEO
                        </NavText>
                    </NavItem>
                    <Separator />
                    <NavItem eventKey="logout">
                        <NavIcon>
                            <i className="fa fa-fw fa-power-off" style={{ fontSize: '1.5em' }} />
                        </NavIcon>
                        <NavText style={{ paddingRight: 32 }} title="SIGN OUT">
                            SIGN OUT
                        </NavText>
                    </NavItem>
                </Nav>
            </SideNav>
            <Main expanded={expanded}>
                {this.renderBreadcrumbs()}
                <div>
                <button onClick={this.start} disabled={this.state.isRecording}>
                     Record
                </button>
                <button onClick={this.stop} disabled={!this.state.isRecording}>
                     Stop
                </button>
                <audio src={this.state.blobURL} controls="controls" />
                <button onClick={}>Enviar</button>
                </div>

                <div class="container">
	      <div class="row">
      	  <div class="offset-md-3 col-md-6">
               <div class="form-group files">
                <label>Upload Your File </label>
                <input type="file" class="form-control" multiple onChange={this.onChangeHandler}/>
              </div>  
              <div class="form-group">
              <ToastContainer />
              <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>
        
              </div> 
              
              <button type="button" class="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>

	      </div>
      </div>
      </div>
            </Main>
        </div>
    
        );      
    }
}

export default withRouter(GravarAudio);
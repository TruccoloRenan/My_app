import React from 'react';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import Breadcrums from '@trendmicro/react-breadcrumbs';
import ensureArray from 'ensure-array';
import styled from 'styled-components';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '../app/StyledSideNav';
import { Link, withRouter } from 'react-router-dom';
import MicRecorder from 'mic-recorder-to-mp3';
import './styleAudio.css';
import Axios from 'axios';
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

    state = {
        selected: 'home',
        expanded: false,
        isRecording: false,
        blobURL:'',
        isBlocked: false,
    }

    start = () => {
        if(this.state.isBlocked){
            console.log('Permission Denied');
        } else {
            Mp3Recorder
            .start
            .then(() => {
                this.setState({ isRecording: true});
            }).catch((e) => console.error(e));
        }
    };

    stop = () => {
        Mp3Recorder
        .stop()
        .getMp3()
        .then(([buffer, blob]) => {
            blobURL = URL.createObjectURL(blob)
            this.setState({ blobURL, isRecording: false});
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

    enviar = async e => {
     var ffmpeg = require('ffmpeg');
     try{

        var path = require('path');
        var process = new ffmpeg(blobURL);
        process.then(function (audio){
            audio.fnExtractFrameToMP3(path.resolve(".audios/file.mp3"), function (error, file) {
                if(!error)
                    console.log("Audio file" + file);
            });
        }, function(err) {
            console.log("Error:" + err);
        })
    }catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }

    try{
        const FormData = require('form-data');
        const fs = require('fs');

        let form = new FormData();

        form.append('file',fs.createReadStream('./audios' + "/audio.mp4"), {
            filename:'audio.mp4'
        });

        Axios.create({
            headers: form.getHeaders()}).post('http://localhost:4004/', form)
            .then(response => {
                console.log(response);
                console.log("Upload realizado com sucesso!")
            }).catch(error => {
                if(error.response){
                    console.log(error.response);
                    console.log("Falha no upload, tente novamente!");
                }
                console.log(error.message);
                console.log("Falha no upload, tente novamente!");
            })
    }catch (err) {
       console.log("Falha no upload, tente novamente!");
    }

  }
  
    componentDidMount() {
        navigator.getUserMedia({audio: true},
        () => {
            console.log('Permission Granted');
            this.setState({ isBlocked: false});
        },
        () => {
            console.log('Permission Denied');
            this.setState({ isBlocked: true })
        },
      );
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
               
                <div className="App">
                    <button onClick={this.start} disabled={this.state.isRecording}>Gravar Audio</button>
                    <button onClick={this.stop} disabled={!this.state.isRecording}>Parar</button>
                    <audio src={this.state.blobURL} controls="controls" />
                    <button onClick={this.enviar}>Enviar</button>
                </div>

            </Main>
        </div>
    
        );      
    }
}

export default withRouter(GravarAudio);
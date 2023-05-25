import React from 'react';

import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import Breadcrums from '@trendmicro/react-breadcrumbs';
import ensureArray from 'ensure-array';
import styled from 'styled-components';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from './StyledSideNav';
import { Link, withRouter } from 'react-router-dom';

const navWidthCollapsed = 64;
const navWidthExpanded = 280;

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

class MainPage extends React.Component {

    state = {
        selected: 'Dashboard Regiao',
        expanded: false
    }

    lastUpdateTime = new Date().toISOString();

    dashboardDia(){
        this.props.history.push("/Dashboard Dia");
    }

    dashboardHora(){
        this.props.history.push("/Dashboard Hora");
    }

    dashboardRegiao(){
        this.props.history.push("/Dashboard Regiao");

    }

    onSelect = (selected) => {
        this.setState({ selected : selected });
        if(selected == "Dashboard Regiao"){
            this.dashboardRegiao();
        }  
        if(selected == "Dashboard Dia"){
            this.dashboardDia();
        } 
        if(selected == "Dashboard Hora"){
            this.dashboardHora();
        } 
    };

    onToggle = (expanded) => {
        this.setState({ expanded: expanded });
    };

    pageTitle = {
        'Dashboard Regiao' : 'Dashboard Regiao',
        //'Dashboard Dia' : ['Dashboard Dia'],
        //'Dashboard Hora' : ['Dashoboard Hora']

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
                    <NavItem eventKey="Dashboard Regiao"> 
                        <NavIcon>
                            <i className="fa fa-fw fa-home" styled={{ fontSize: '1.75em', verticalAlign: 'middle' }} />
                        </NavIcon>
                        <NavText styled={{ paddingRight: 32 }} title="Dashboard Regiao">
                        Dashboard Regiao
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="Dashboard Dia">
                        <NavIcon>
                            <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em', verticalAlign: 'middle'}}/>
                        </NavIcon>
                        <NavText style={{ paddingRight: 32}} title="Dashboard Dia">
                        Dashboard Dia
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="Dashboard Hora">
                        <NavIcon>
                            <i className="fa fa-fw fa-list-alt" style={{ fontSize: '1.75em', verticalAlign: 'middle' }}/>
                        </NavIcon>
                        <NavText style={{ paddingRight: 32}} title="Dashboard Hora">
                        Dashboard Hora
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
            </Main>
        </div>
    
        );      
    }
}

export default withRouter(MainPage);
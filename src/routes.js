import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/signIn';
import MainPage from './pages/app/Dashboard Regiao';
import DashboardDia from './pages/app/DashboardDia';
import DashboardHora from './pages/app/DashboardHora';

import { isAuthenticated } from "./services/auth";

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route 
        {...rest}
        render={props =>
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: "/", state: { from: props.location }} } />

            )
        }
    />
);

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={SignIn} />
            <Route path="/Signup" component={SignUp} />
            <Route path="/Dashboard Hora" component={DashboardHora} />
            <Route path="/Dashboard Dia" component={DashboardDia} />
            <PrivateRoute path="/Dashboard Regiao" component={MainPage} />
            <Route path="*" component={() => <h1>Page not Found</h1>} />
        </Switch>
    </BrowserRouter>
);

export default Routes;
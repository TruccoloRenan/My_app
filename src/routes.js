import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/signIn';
import MainPage from './pages/app';
import GravarAudio from './pages/Recorder/GravarAudio';
import GravarVideo from './pages/Recorder/GravarVideo';

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
            <Route path="/signup" component={SignUp} />
            <Route path="/gravarAudio" component={GravarAudio} />
            <Route path="/gravarVideo" component={GravarVideo} />
            <PrivateRoute path="/app" component={MainPage} />
            <Route path="*" component={() => <h1>Page not Found</h1>} />
        </Switch>
    </BrowserRouter>
);

export default Routes;
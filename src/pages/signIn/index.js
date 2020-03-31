import React, { Component } from "react";
import { Link, withRouter } from 'react-router-dom';

import Logo from '../../assets/helper.png';
import api from "../../services/api";
import { login } from '../../services/auth';

import { Form, Container } from './styles';

class SignIn extends Component {
    state = {
        email: "",
        password: "",
        error: ""
    };

    handleSignIn = async e => {
        e.preventDefault();
        const { email, password } = this.state;
        if (!email || !password) {
            this.setState({ error: "Preencha E-Mail e senha para continuar!" });
        } else {
            try{
                const data = {
                    email: email,
                    password: password
                }

                const response = await api.post("/api/usuarios/login", data);
                login(response.data.token);
                this.props.history.push("/App");
            }catch (err) {
                this.setState({
                    error: "Houve um problema com o login, verifique suas credenciais!"
                });
            }
        }
    };

    render() {
        return (
            <Container>
                <Form onSubmit={this.handleSignIn}>
                    <img src={Logo} alt="Helper Logo"/>
                    {this.state.error && <p>{this.state.error}</p>}
                    <input
                    type="email"
                    placeholder="Endereço de E-Mail"
                    onChange={e => this.setState({ email: e.target.value })}
                    />
                    <input
                    type="password"
                    placeholder="Senha"
                    onChange={e => this.setState({ password: e.target.value })}
                    />
                    <button type="submit">Entrar</button>
                    <hr />
                    <Link to="/Signup">Criar Conta</Link>
                </Form>
            </Container>
        );
    }
}

export default withRouter(SignIn);
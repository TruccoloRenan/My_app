import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
//import api from '../../services/api'

import Logo from "../../images/helper.png";

import { Form, Container } from "./styles";

class SignUp extends Component {
    state = {
        username: "",
        email: "",
        password: "",
        error: "",
    };

    handleSignUp = e => {
        e.preventDefault();
        const { username, email, password } = this.state;
        if (!username || !email || !password) {
            this.setState({ error: "preencha todos os dados para se cadastrar"});
        } else {
            try {
                alert("nao implementado so teste")
            }catch (err) {
                console.log(err);
                this.setState({ error: "Ocorreu um erro ao registrar sua conta!"})
            }
        }
    };

    render() {
        return (
            <Container>
                <Form onSubmit={this.handleSignUp}>
                    <img src={Logo} alt="Helper logo" />
                    {this.state.error && <p>{this.state.error}</p>}
                    <input 
                    type="text"
                    placeholder="Nome do Usuario"
                    onChange={e => this.setState({ email: e.target.value})}
                    />
                    <input 
                    type="email"
                    placeholder="Endereço de E-Mail"
                    onChange={e => this.setState({ email: e.target.value })}
                    />
                    <input 
                    type="password"
                    placeholder="Senha"
                    onChange={e => this.setState({ password: e.target.value})}
                    />
                    <button type="submit">Cadastrar</button>
                    <hr />
                    <Link to="/">Fazer Login</Link>
                </Form>
            </Container>
        )
    }
}

export default withRouter(SignUp);
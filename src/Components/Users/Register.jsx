import React, { Component } from "react";
import '../../CssComponents/Users/register.css';
import AlertMsg from '../Global/AlertMsg'

var jwt = require('jsonwebtoken');

class Register extends Component {
    constructor() {
        super();
        this.state = {
            alertText: '',
            alertisNotVisible: true,
            alertColor: 'danger',
            data: []
        };
        this.changeStatus = this.changeStatus.bind(this);
    }

    //Altera o estado conforme o Alert
    changeStatus() {
        this.setState({ alertisNotVisible: true });
    }
    logout() {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
    }

    getRole() {
        try {
            var decoded = jwt.decode(sessionStorage.getItem('token'));
            var role = decoded.isAdmin;
            return role;
        } catch (err) {
            sessionStorage.clear();
            window.location = "/";
        }
    }
    async refreshToken() {
        var decoded = jwt.decode(sessionStorage.getItem('token'));
        var nome = decoded.nome;
        var username = decoded.username;
        const dataToken = {
            username,
            nome
        }
        const response = await fetch('http://localhost:8000/token/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToken)
        });

        await response.json().then(resp => {
            //Verificar o estado da resposta da API
            let status = resp.status;
            switch (status) {
                case "Token Atualizado":
                    sessionStorage.clear();
                    sessionStorage.setItem('token', resp.response);
                    break;

                default:
                    window.location = "/"
            }
        });
    }

    redirecionar() {
        window.location = "/";
    }


    handleSubmit = async e => {
        e.preventDefault();
        //Objeto Login
        //verificar o role
        var role = true;
        var tipoUtilizador = document.getElementById('tipoUtilizador').value;
        if (tipoUtilizador === "Não Administrador") {
            role = false;
        }
        const registerData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            username: document.getElementById('username').value,
            hashPassword: document.getElementById('password').value,
            isAdmin: role
        };

        //Enviar pedidos
        const response = await fetch('http://localhost:8000/user/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": sessionStorage.getItem("token")
            },
            body: JSON.stringify(registerData)
        });
        await response.json().then(resp => {
            //console.log(resp);
            //Verificar o estado da resposta da API
            let status = resp.status;
            switch (status) {
                case "Email e/ou username já existe(m) na base de dados":
                    this.setState({
                        alertText: "    Email e/ou username já existe(m) na base de dados.",
                        alertisNotVisible: false,
                        alertColor: "warning"
                    });
                    break;
                case "Erros na validação":
                    this.setState({ data: resp.response });
                    this.setState({
                        alertText: this.state.data[0].msg,
                        alertisNotVisible: false,
                        alertColor: "warning"
                    });
                    break;
                case "Utilizador Criado com Sucesso":
                    this.setState({
                        alertText: "    Utilizador Criado com Sucesso.",
                        alertisNotVisible: false,
                        alertColor: "success"
                    });
                    setTimeout(this.redirecionar, 2000);
                    break;
                case "Nao está autenticado | token expirou":
                    this.refreshToken();
                    this.handleSubmit(e);
                    break;
                default:
                    console.log(this.state.alertText)
            }
        });
    };

    render() {
        if (sessionStorage.getItem('token') != null)
            if (this.getRole() === true) {
                return (
                    <div className="Inicio container">
                        <div className="container">
                            <br />

                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <h1 className="display-4 ">Criar novo utilizador</h1>
                                </div>
                            </div>
                            <AlertMsg
                                text={this.state.alertText}
                                isNotVisible={this.state.alertisNotVisible}
                                alertColor={this.state.alertColor}
                            />
                            <br />
                            <main className="my-form">
                                <div className="cotainer">
                                    <div className="row justify-content-center">
                                        <div className="col-md-8">
                                            <div className="card">
                                                <div className="card-header">Criar novo utilizador</div>
                                                <div className="card-body">
                                                    <form onSubmit={this.handleSubmit}>
                                                        <div className="form-group row">
                                                            <label htmlFor="full_name" className="col-md-4 col-form-label text-md-right">Nome</label>
                                                            <div className="col-md-6">
                                                                <input type="text" id="nome" className="form-control" name="full-name" required></input>
                                                            </div>
                                                        </div>

                                                        <div className="form-group row">
                                                            <label htmlFor="email_address" className="col-md-4 col-form-label text-md-right">E-Mail</label>
                                                            <div className="col-md-6">
                                                                <input type="text" id="email" className="form-control" name="email-address" required></input>
                                                            </div>
                                                        </div>

                                                        <div className="form-group row">
                                                            <label htmlFor="user_name" className="col-md-4 col-form-label text-md-right">Username</label>
                                                            <div className="col-md-6">
                                                                <input type="text" id="username" className="form-control" name="username" required></input>
                                                            </div>
                                                        </div>

                                                        <div className="form-group row">
                                                            <label htmlFor="password" className="col-md-4 col-form-label text-md-right">Password</label>
                                                            <div className="col-md-6">
                                                                <input type="password" id="password" className="form-control" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" title="Introduza pelo menos 8 caracteres, incluindo letras maíusculas, minusculas, algarismos e caracteres especiais" required></input>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label>Tipo de Utilizador</label>
                                                            <select id="tipoUtilizador" className="form-control" defaultValue={'Administrador'}>
                                                                <option value="Administrador" >Administrador...</option>
                                                                <option value="Não Administrador">Não Administrador</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-6 offset-md-4">
                                                            <button type="submit" className="btn">
                                                                Criar Utilizador
                                                            </button>
                                                        </div>

                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </main>
                        </div>
                    </div>
                );
            }
            else {
                window.location = "*";
            }
        else {
            window.location = "*";
        }
    }
}

export default Register;
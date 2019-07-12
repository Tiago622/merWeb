import React, { Component } from "react";
import "../../CssComponents/Users/index.css"
import AlertMsg from "../Global/AlertMsg"

var jwt = require('jsonwebtoken');

class Index extends Component {
    constructor() {
        super();
        this.state = {
            alertText: 'Ocorreu um erro técnico. Tente novamente mais tarde',
            alertisNotVisible: true,
            alertColor: 'danger',
            data: [],
        };
    }

    componentDidMount() {
        this.getUsers();
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

    async getUsers() {
        const response = await fetch(`http://localhost:8000/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
        });
        //Aguardar API
        await response.json().then(resp => {
            let status = resp.status;
            switch (status) {
                case "Failed to authenticate token.":
                    this.setState({
                        alertText: "  Inicie Sessão por favor.",
                        alertisNotVisible: false,
                        alertColor: "warning"
                    });
                    break;
                case "Utilizadores na Base de Dados":
                    this.setState({ data: resp.response });
                    break;
                default:
                    console.log(this.state.alertText)
                    break;
            }

        });

    }

    render() {
        //Verifica se existe o token
        if (sessionStorage.getItem("token") == null) {
            window.location = "/";
        } else {
            if (this.getRole() === true) {
                return (
                    <div className="container">
                        <div className="row">
                            <div className="col-md-9">
                                <h2 className="py-3 mb-3 text-center">
                                    Lista de Utilizadores
                            </h2>
                            </div>
                        </div>
                        <AlertMsg
                            text={this.state.alertText}
                            isNotVisible={this.state.alertisNotVisible}
                            alertColor={this.state.alertColor}
                        />

                        <table className="table table-sm table-hover">
                            <thead >
                                <tr id="cabecalho">
                                    <th scope="col">Email</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Nome</th>
                                    {/*<th scope="col"></th>*/}
                                </tr>
                            </thead>
                            <tbody id="corpo">
                                {this.state.data.map(function (obj) {
                                    //let href = "/utilizadores/" + obj.userID;
                                    return (
                                        <tr className="align-middle" key={obj.userID} >
                                            <td className="align-middle">{obj.email}</td>
                                            <td className="align-middle" >{obj.username}</td>
                                            <td className="align-middle"> {obj.nome}</td>
                                        </tr>
                                    );
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                );
            }
            else {
                window.location = "*"
            }
        }

    }
}
export default Index;

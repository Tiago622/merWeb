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

    async refreshToken() {
        var decoded = jwt.decode(sessionStorage.getItem('token'));
        var nome = decoded.nome;
        var username = decoded.username;
        var userID = decoded.userID;
        var isAdmin = decoded.isAdmin;
        const dataToken = {
          username,
          nome,
          userID,
          isAdmin
        }
        const response = await fetch('https://merapi.herokuapp.com/token/refresh', {
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
    

    async getUsers() {
        const response = await fetch(`https://merapi.herokuapp.com/user`, {
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
                case "Nao está autenticado | token expirou":
                    this.refreshToken();
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
                    <center>
                    <div className="containerIndexUser" style={{color:"white",fontSize:"15px",fontWeight:"bold"}}>
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

                        <table className="table table-sm">
                            <thead >
                                <tr id="cabecalho" style={{color:"white"}}>
                                    <th scope="col" >Email </th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Nome</th>
                                    {/*<th scope="col"></th>*/}
                                </tr>
                            </thead>
                            <tbody id="corpo" style={{color:"white"}}>
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
                    </center>
                );
            }
            else {
                window.location = "*"
            }
        }

    }
}
export default Index;

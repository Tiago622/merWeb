import "../../CssComponents/Users/profile.css";
import logoUser from '../../fotoUser.png';
import AlertMsg from '../Global/AlertMsg';
import AlertMsg2 from '../Global/AlertMsg';
import React, { Component } from "react";
var jwt = require('jsonwebtoken');

class Perfil extends Component {
  constructor() {
    super();
    this.state = {
      alertText: '',
      alertisNotVisible: true,
      alertColor: 'danger',
      dataGet: [],
      dataPost: []
    };
  }

  componentDidMount() {
    var decoded = jwt.decode(sessionStorage.getItem('token'));
    var username = decoded.username;
    this.getDetails(username);
  }

  out() {
    sessionStorage.clear();
    window.location = "/login";
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

  async refreshTokenDados(userAlterado) {
    var nome = userAlterado.nome;
    var username = userAlterado.username;
    var userID = userAlterado.userID;
    var isAdmin = userAlterado.isAdmin;
    const dataToken = {
      username,
      nome,
      userID,
      isAdmin
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
  getDetails = async (username) => {
    const response = await fetch(`http://localhost:8000/user/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': sessionStorage.getItem('token')
      },
    });

    await response.json().then(resp => {
      let status = resp.status;
      switch (status) {
        case "Utilizador está na base de dados":
          this.setState({ dataGet: resp.response });
          break;
        case "Nao está autenticado | token expirou":
          this.refreshToken();
          this.getDetails(username);
          break;
        default:
          console.log("erro")
          break;
      }
    })
  }


  handleSubmit = async e => {
    e.preventDefault();


    if (
      document.getElementById("pass").value !==
      document.getElementById("passConfirmer").value
    ) {
      this.setState({
        alertText: "As palavras-passe não são iguais",
        alertisNotVisible: false,
        alertColor: "warning"
      });
      return null;
    }
    else {
      var decoded = jwt.decode(sessionStorage.getItem('token'));
      var usernameURL = decoded.username;


      const password = document.getElementById('pass').value;
      const dados = { /*'nome': nome, 'email': email, 'username': username, */'hashPassword': password }
      const response = await fetch(`http://localhost:8000/user/${usernameURL}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify(dados)
      })
      await response.json().then(resp => {
        let status = resp.status;
        switch (status) {
          case "Updated":
            this.setState({ dataPost: resp.response });
            this.setState({
              alertText: "Password Alterada! Por segurança, será redirecionado para a página de autenticação.",
              alertisNotVisible: false,
              alertColor: "warning"
            });
            setTimeout(() => {
              this.out();
            }, 4000);

            break;
          case "Nao está autenticado | token expirou":
            this.refreshToken();
            this.handleSubmit(e);
            break;
          default:
            console.log("erro")
            break;
        }
      })
    }

  }


  handleSubmitDados = async e => {
    e.preventDefault();


    var decoded = jwt.decode(sessionStorage.getItem('token'));
    var usernameURL = decoded.username;
    var dadosAlterados = {
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      nome: document.getElementById('nome').value,
      dadosExistentes:{
        username: document.getElementById('username').placeholder,
        email: document.getElementById('email').placeholder,
        nome: document.getElementById('nome').placeholder
        }
    }
    //Verifica se não foi preenchido algum campo
   
    const response = await fetch(`http://localhost:8000/user/${usernameURL}/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify(dadosAlterados)
    })
    await response.json().then(resp => {
      let status = resp.status;
      switch (status) {
        case "Updated":
          this.setState({ dataPost: resp.response });
          this.setState({
            alertText: "Dados Alterados com sucesso",
            alertisNotVisible: false,
            alertColor: "warning"
          });
          setTimeout(() => {
            this.refreshTokenDados(resp.response);
            window.location="/perfil";
          }, 1000);
          break;
        case "Nao está autenticado | token expirou":
          this.refreshToken();
          this.handleSubmitDados(e);
          break;
        case "Not Updated | Username ou email já existem":
          this.setState({
            alertText: "Username ou email já existem",
            alertisNotVisible: false,
            alertColor: "warning"
          });
          break;
        default:
          console.log("erro")
          break;
      }
    })


  }

  render() {
    if (sessionStorage.getItem('token') != null)

      return (
        <div>
          <br></br>
          <h2 style={{ textAlign: "center" }}>Perfil de Utilizador</h2>

          <div className="cardUser">
            <center>
              <img src={logoUser} alt="John" style={{ width: "50%" }}></img>
            </center>
            <h1>{this.state.dataGet.nome}</h1>
            <hr></hr>
            <p className="title">Username : {this.state.dataGet.username}</p>
            <p className="title">Email : {this.state.dataGet.email}</p>

            <div style={{ margin: "24px 0" }}>
            </div>
            <p><button className="buttonPerfil" data-toggle="modal" data-target="#exampleModalPassword">Alterar Password</button></p>
            <p><button className="buttonPerfil" data-toggle="modal" data-target="#exampleModalDadosPessoais">Alterar Dados </button></p>
          </div>
          <div className="pt-3 py-3 text-center">
            <div className="modal fade" id="exampleModalPassword" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Alterar Password</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={this.handleSubmit}>
                      <h2>Alterar Password</h2>
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <label>Palavra-passe</label>
                          <input
                            type="password"
                            className="form-control"
                            id="pass"
                            placeholder="Palavra-passe"
                            required
                            pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
                            title="Introduza pelo menos 8 caracteres, incluindo letras maíusculas, minusculas, algarismos e caracteres especiais"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <label>Confirmar palavra-passe</label>
                          <input
                            type="password"
                            className="form-control"
                            id="passConfirmer"
                            placeholder="Confirmar palavra-passe"
                            required
                          />
                        </div>
                      </div>
                      <AlertMsg
                        text={this.state.alertText}
                        isNotVisible={this.state.alertisNotVisible}
                        alertColor={this.state.alertColor}
                      />
                      <div className="modal-footer">
                        <button className="btn btn-success" type="search">Alterar Password</button>
                        <button type="button" className="btn btn-danger" data-dismiss="modal">Fechar</button>
                      </div>
                    </form>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="exampleModalDadosPessoais" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Alterar Dados Pessoais</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={this.handleSubmitDados}>
                    <div className="form-group row">
                      <label htmlFor="email" className="col-md-4 col-form-label text-md-right">E-Mail</label>
                      <div className="col-md-6">
                        <input type="text" id="email" className="form-control" name="email-address" placeholder={this.state.dataGet.email} ></input>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label htmlFor="username" className="col-md-4 col-form-label text-md-right">Username</label>
                      <div className="col-md-6">
                        <input type="text" id="username" className="form-control" name="username" placeholder={this.state.dataGet.username} ></input>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label htmlFor="nome" className="col-md-4 col-form-label text-md-right">Nome</label>
                      <div className="col-md-6">
                        <input type="text" id="nome" className="form-control" name="full-name" placeholder={this.state.dataGet.nome} ></input>
                      </div>
                    </div>
                    <AlertMsg2
                        text={this.state.alertText}
                        isNotVisible={this.state.alertisNotVisible}
                        alertColor={this.state.alertColor}
                      />
                    <div className="modal-footer">
                      <button className="btn btn-danger" type="search">Guardar Dados</button>
                      <button type="button" className="btn btn-danger" data-dismiss="modal">Sair</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    else {
      window.location = "*";
    }


  }





}

export default Perfil;
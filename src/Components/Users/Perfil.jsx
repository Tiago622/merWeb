import "../../CssComponents/Users/profile.css";
import logoUser from '../../fotoUser.png';
import AlertMsg from '../Global/AlertMsg';
import AlertMsg2 from '../Global/AlertMsg';
import AlertMsg3 from '../Global/AlertMsg';
import AlertMsg4 from '../Global/AlertMsg';


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
      dataPost: [],
      dataMusic: [],
      dataListasReproducao: [],
      dataMusicListas: []
    };
  }

  componentDidMount() {
    var decoded = jwt.decode(sessionStorage.getItem('token'));
    var username = decoded.username;
    this.getDetails(username);
    this.musicasInseridas();
    this.listasReproducao();
    if (this.state.dataMusic.length === 0) {
      var musicasUser = document.getElementById('musicasUser');
      musicasUser.style.display = "none";
    }
    if (this.state.dataListasReproducao.length === 0) {
      var divListas = document.getElementById('listasReproUser');
      divListas.style.display = "none";
    }


  }
  mostraDivMusicas() {
    var musicasUser = document.getElementById('musicasUser');
    if (musicasUser.style.display === "none") {
      musicasUser.style.display = "block";
    } else {
      musicasUser.style.display = "none";
    }
  }

  mostraDivListas() {
    var listasReproUser = document.getElementById('listasReproUser');
    if (listasReproUser.style.display === "none") {
      listasReproUser.style.display = "block";
    } else {
      listasReproUser.style.display = "none";
    }
  }
  out() {
    sessionStorage.clear();
    window.location = "/login";
  }

  async getMusicasLista(listaFK) {
    const dados = {
      listaFK: listaFK
    }
    const response = await fetch('https://merapi.herokuapp.com/listmusic/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify(dados)
    });
    await response.json().then(resp => {
      this.setState({ dataMusicListas: [] });

      let status = resp.status;
      switch (status) {
        case "Lista sem músicas":

          break;
        case "Existem músicas nesta lista":

          this.setState({ dataMusicListas: resp.response });

          break;
        case "Nao está autenticado | token expirou":
          this.refreshToken();
          this.getMusicasLista(listaFK);
          break;

        default: console.log("erro ao listar musicas de uma lista")
      }
    });
  }

  async excluiMusica(listaFK, musicFK) {
    const dados = {
      listaFK: listaFK,
      musicFK: musicFK
    }
    const response = await fetch('https://merapi.herokuapp.com/listmusic/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify(dados)
    });
    await response.json().then(resp => {
      let status = resp.status;
      switch (status) {
        case "Música Eliminada da lista com sucesso":
          this.setState({
            alertText: "Música Eliminada da lista com sucesso",
            alertisNotVisible: false,
            alertColor: "warning"
          });
          window.location.reload();
          break;
        case "Musica não eliminada da lista":
          break;
        case "Nao está autenticado | token expirou":
          this.refreshToken();
          this.excluiMusica(listaFK, musicFK);
          break;

        default: console.log("erro a apagar a música da lista")
      }

    });

  }

  criaLista = async e => {

    e.preventDefault();
    var decoded = jwt.decode(sessionStorage.getItem('token'));
    var nomeLista = document.getElementById('nomeLista').value;
    var dados = {
      userFK: decoded.userID,
      nomeLista: nomeLista
    }

    const response = await fetch('https://merapi.herokuapp.com/list/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify(dados)
    });
    await response.json().then(resp => {
      let status = resp.status;
      switch (status) {
        case "Lista criada":
          this.setState({
            alertText: " Lista criada.",
            alertisNotVisible: false,
            alertColor: "success"
          });
          setTimeout(() => {
            window.location = "/perfil";
          }, 2000);
          break;
        case "Já existe uma lista com o nome escolhido":
          this.setState({
            alertText: " Já existe uma lista com o nome escolhido.",
            alertisNotVisible: false,
            alertColor: "warning"
          });
          break;
        case "Nao está autenticado | token expirou":
          this.refreshToken();
          this.criaLista(e);
          break;
        default:
      }
    });

  }

  async apagaLista(listaID) {

    const response = await fetch(`https://merapi.herokuapp.com/list/${listaID}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': sessionStorage.getItem('token')
      }
    });
    await response.json().then(resp => {
      let status = resp.status;
      switch (status) {
        case "Lista Eliminada com sucesso":
          this.setState({
            alertText: " Lista eliminada com sucesso.",
            alertisNotVisible: false,
            alertColor: "success"
          });
          setTimeout(() => {
            window.location = "/perfil";
          }, 2000);
          break;
        case "Lista não eliminada":
          this.setState({
            alertText: "A lista não foi eliminada.",
            alertisNotVisible: false,
            alertColor: "warning"
          });
          break;
        case "Nao está autenticado | token expirou":
          this.refreshToken();
          this.apagaLista(listaID);
          break;
        default: console.log("erro a eliminar lista")
      }
    });

  }

  async listasReproducao() {
    var decoded = jwt.decode(sessionStorage.getItem('token'));
    var dados = {
      userFK: decoded.userID
    }
    const response = await fetch('https://merapi.herokuapp.com/list/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify(dados)
    });
    await response.json().then(resp => {
      let status = resp.status;
      switch (status) {
        case "Lista Listadas com sucesso":
          this.setState({ dataListasReproducao: resp.response });
          break;
        case "Não existe listas":
          break;
        case "Nao está autenticado | token expirou":
          this.refreshToken();
          this.listasReproducao();
          break;
        default:
      }
    });



  }
  async musicasInseridas() {
    var decoded = jwt.decode(sessionStorage.getItem('token'));
    var userFK = decoded.userID;

    var dados = {
      userFK: userFK
    }
    const response = await fetch('https://merapi.herokuapp.com/music/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify(dados)
    });
    await response.json().then(resp => {
      let status = resp.status;
      switch (status) {
        case "Musicas associadas ao utilizador":
          this.setState({ dataMusic: resp.response });
          break;
        case "Failed to authenticate token.":
          this.refreshToken();
          this.musicasInseridas();
          break;
        default:
      }
    });

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
  getDetails = async (username) => {
    const response = await fetch(`https://merapi.herokuapp.com/user/${username}`, {
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
      const response = await fetch(`https://merapi.herokuapp.com/user/${usernameURL}/edit`, {
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
      dadosExistentes: {
        username: document.getElementById('username').placeholder,
        email: document.getElementById('email').placeholder,
        nome: document.getElementById('nome').placeholder
      }
    }
    //Verifica se não foi preenchido algum campo

    const response = await fetch(`https://merapi.herokuapp.com/user/${usernameURL}/edit`, {
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
            window.location = "/perfil";
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
        <div className="perfil">
          <br></br>
          <h2 style={{ textAlign: "center" }}>Perfil de Utilizador</h2>

          <div className="cardUser">
            <center>
              <img src={logoUser} alt="alt" style={{ width: "20%" }}></img>
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
          <div>
            <center>

              <div style={{ width: "300px" }} className="">
                <br></br>
                <button style={{ width: "100%" }} onClick={this.mostraDivListas} className="btn btn-secondary" >Consultar Listas de Reprodução</button>
                <AlertMsg4
                  text={this.state.alertText}
                  isNotVisible={this.state.alertisNotVisible}
                  alertColor={this.state.alertColor}
                />

              </div>
            </center>
            <br></br>
            <center>
              <div id="listasReproUser">
                <form onSubmit={this.criaLista} >
                  <input id="nomeLista" type="text" style={{ marginRight: "15px" }} required />
                  <button type="submit"  >Criar nova lista</button>

                </form>


                {
                  this.state.dataListasReproducao.map((data, index) => {
                    return (

                      <div key={index} className="">
                        <div>

                          <div >
                            <i id="aLista" data-toggle="modal" data-target={"#exampleModal" + index} onClick={() => { this.getMusicasLista(data.listaID) }} style={{ backgroundColor: "none", fontSize: "30px", marginLeft: "10px", cursor: "pointer" }}><i style={{ fontSize: "30px" }} className="fa fa-caret-square-o-right"></i>{" " + data.nomeLista}</i>
                            <i className="fa fa-trash" style={{ marginLeft: "10px", fontSize: "25px", color: "red", cursor: "pointer" }} onClick={() => { this.apagaLista(data.listaID) }}></i>
                          </div>
                        </div>
                        <div className="modal fade" id={"exampleModal" + index} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <center>
                                  <h5 className="modal-title" id="exampleModalLabel" style={{ color: "black" }}>{data.nomeLista}</h5>
                                  <AlertMsg3
                                    text={this.state.alertText}
                                    isNotVisible={this.state.alertisNotVisible}
                                    alertColor={this.state.alertColor}
                                  />
                                </center>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <center>
                                {
                                  this.state.dataMusicListas.map((data, index) => {

                                    return (

                                      <div key={index} className="modalMusicasLista">
                                        <p>Música {index + 1}</p>
                                        <button style={{ backgroundColor: "#d4cbcb" }} className="btn btn-light" onClick={() => { this.excluiMusica(data.listaFK, data.musicFK) }}>Exluir música da lista</button>

                                        <p>{data.Music.name}</p>

                                        <iframe src={"https://www.youtube.com/embed/" + data.Music.idVideo} allowFullScreen id="video" title={data.Music.name}></iframe>
                                        <h3 style={{ fontWeight: "lighter", color: "orange" }}>Emoção: {data.Music.emocao}</h3>
                                        <hr></hr>
                                      </div>
                                    )
                                  })
                                }
                              </center>
                            </div>
                          </div>
                        </div>
                      </div>

                    )
                  })
                }

              </div>
            </center>
            <br></br>
            <div className="pt-3 py-3 text-center">

              <h5>Quais as músicas introduzidas por mim?</h5><button className="buttonConsultas" onClick={this.mostraDivMusicas}>Consulte Aqui<i style={{ marginLeft: "5px" }} className="fa fa-sort-down"></i></button>
            </div>
            <center>
              <div id="musicasUser" style={{ color: "black" }}>
                <div className="input-group mb-2 col-md-12">

                  {
                    this.state.dataMusic.map((data, index) => {
                      return (

                        <div key={index} className="col-lg-4 col-md-2 mb-6">

                          <div className="modal-dialog modal-lg">

                            <div className="modal-content">

                              <div className="modal-body mb-0 p-0">


                                <iframe id="frame" style={{ width: "100%" }} src={"https://www.youtube.com/embed/" + data.idVideo}
                                  title={data.name} autoPlay allowFullScreen></iframe>


                              </div>

                              <div className="justify-content-center">
                                <p>{data.name}</p>
                                {(data.emocao === "") ? (
                                  <h5>(Música está a ser classificada. Por favor aguarde.) </h5>
                                ) : (
                                    <h5>{data.emocao}</h5>
                                  )}
                              </div>

                            </div>

                          </div>


                        </div>

                      )
                    })
                  }
                </div>
              </div>
            </center>
          </div>

          <div className="pt-3 py-3 text-center">
            <div className="modal fade" id="exampleModalPassword" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel" style={{ color: "black" }}>Alterar Password</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body" style={{ color: "black" }}>
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
                  <h5 className="modal-title" id="exampleModalLabel" style={{ color: "black" }}>Alterar Dados Pessoais</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body" style={{ color: "black" }}>
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
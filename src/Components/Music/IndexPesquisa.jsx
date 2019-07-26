import React, { Component } from "react";
import '../../CssComponents/index.css'
import LoadingGif from '../Global/LoadingGif';
import AlertMsg from '../Global/AlertMsg';
import AlertMsg2 from '../Global/AlertMsg';
var jwt = require('jsonwebtoken');

class IndexPesquisa extends Component {

  constructor() {
    super();
    this.state = {
      alertText: "Ocorreu um erro técnico. Tente novamente mais tarde",
      alertisNotVisible: true,
      alertColor: "danger",
      dataGet: [],
      dataListasReproducao: [],
      isHidden: false

    }
  }

  componentDidMount() {
    this.pesquisaMusica(this.props.query);

    //teste
    //this.setState({ dataGet: window.history.state.response })
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

  async getMusicFK(idVideo) {
    const response = await fetch(`https://merapi.herokuapp.com/music/${idVideo}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': sessionStorage.getItem('token')
      }
    });
    await response.json().then(resp => {
      let status = resp.status;
      switch (status) {
        case "URL não está presente na base de dados":
          break;
        case "URL com o id " + idVideo + " está na base de dados":
          this.setState({ dataMusicParaLista: resp.response });

          break;
        default: console.log("erro")
      }

    })
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
        default:
      }
    });



  }


  async refreshToken() {
    var decoded = jwt.decode(sessionStorage.getItem('token'));
    var nome = decoded.nome;
    var isAdmin = decoded.isAdmin;
    var userID = decoded.userID;
    var username = decoded.username;
    const dataToken = {
      username,
      nome,
      isAdmin,
      userID
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
  async atualizaListaFeedback() {
    var j;
    for (j = 0; j < this.state.dataGet.length; j++) {


      var decoded = jwt.decode(sessionStorage.getItem('token'));
      const dadosEnviar = {
        userFK: decoded.userID,
        musicFK: this.state.dataGet[j].id
      };
      //verificar se já foi feito um feedback à musica pelo utilizador em questão
      const response = await fetch(`https://merapi.herokuapp.com/feedback/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "x-access-token": sessionStorage.getItem("token")
        },
        body: JSON.stringify(dadosEnviar)
      });

      await response.json().then(resp => {
        if (resp.status === "Nao está autenticado | token expirou") {
          this.refreshToken();
          this.atualizaListaFeedback();
        }
        else {
          if (resp.status !== "Não existe feedback ainda para esta música") {
            //recolher o feedback do utilizador
            var feedback = resp.response.feedback;
            //recolher os botões like e deslike
            var gostar = document.getElementById(resp.response.Music.idVideo + "G");
            var naoGostar = document.getElementById(resp.response.Music.idVideo + "N");
            var textLike = document.getElementById(resp.response.Music.idVideo + "T");
            gostar.style.color = "";
            naoGostar.style.color = "";
            textLike.textContent = "Gostou desta classificação?"

            if (feedback === true) {
              gostar.style.color = "red"
              textLike.textContent = "Gostei da classificaçao"
            }
            if (feedback === null) {
              gostar.style.color = "";
              naoGostar.style.color = "";
              textLike.textContent = "Gostou desta classificação?"

            }
            if (feedback === false) {
              naoGostar.style.color = "red"
              textLike.textContent = "Não gostei da classificaçao"
            }
          }
        }
      });
    }
  }

  async pesquisaMusica(pesquisaARealizar) {
    const response = await fetch(`https://merapi.herokuapp.com/music/search/result/${pesquisaARealizar}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    //Aguardar API
    await response.json().then(resp => {
      if (resp.response.length !== 0) {
        //Verificar o estado da resposta da API
        this.setState({ dataGet: resp.response })
        this.setState({ isHidden: true })
        if (jwt.decode(sessionStorage.getItem('token')) !== null) {
          this.atualizaListaFeedback();
          this.listasReproducao();
        }
      }
      else {
        this.setState({ isHidden: true })
        this.setState({ dataGet: "vazio" })
      }


    });
  }

  redirecionar() {
    window.location = "/";
  }

  eliminarMusica = async e => {
    const id = e.target.id;
    const response = await fetch(`https://merapi.herokuapp.com/music/${id}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "x-access-token": sessionStorage.getItem("token")
      }
    }
    );
    //Aguardar API
    await response.json().then(resp => {

      //Verificar o estado da resposta da API
      let status = resp.status;
      switch (status) {
        case "Failed to authenticate token.":
          this.setState({
            alertText: "  Inicie Sessão por favor.",
            alertisNotVisible: false,
            alertColor: "warning"
          });
          break;
        case "Deleted":
          this.setState({
            alertText: "  O vídeo foi eliminado.",
            alertisNotVisible: false,
            alertColor: "success"
          });
          setTimeout(this.redirecionar, 2000);
          break;
        case "Not Deleted | Música não está na base de dados":
          this.setState({
            alertText: " O vídeo que está a tentar eliminar não existe.",
            alertisNotVisible: false,
            alertColor: "warning"
          });
          setTimeout(this.redirecionar, 2000);
          break;
        default:
          console.log(this.state.alertText);
      }
    });
  }

  async adicionaMusicaALista() {


    var listaFK;
    var musicFK = this.state.dataMusicParaLista.id;

    this.state.dataListasReproducao.map((data2, index2) => {
      var listaChecked = document.getElementById("lista" + index2);
      if (listaChecked.checked === true) {
        listaFK = data2.listaID;
      }
      return listaFK;
    })
    const dadosEnviar = {
      listaFK: listaFK,
      musicFK: musicFK
    }
    const response = await fetch(`https://merapi.herokuapp.com/listmusic/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "x-access-token": sessionStorage.getItem("token")
      },
      body: JSON.stringify(dadosEnviar)
    });

    await response.json().then(resp => {
      let status = resp.status;
      switch (status) {
        case "Musica adicionada à lista":
          this.setState({
            alertText: "Música Adicionada com sucesso à lista",
            alertisNotVisible: false,
            alertColor: "warning"
          });
          setTimeout(() => {
            window.location = "/perfil"

          }, 2000);
          break;
        case "Musica já existe na lista":
          this.setState({
            alertText: "Música já está presente na lista selecionada",
            alertisNotVisible: false,
            alertColor: "warning"
          });
          break;
        default:
      }
    });
  }

  async createFeedBack(createFeed, idVideo) {
    const response = await fetch(`https://merapi.herokuapp.com/feedback/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "x-access-token": sessionStorage.getItem("token")
      },
      body: JSON.stringify(createFeed)
    });

    await response.json().then(resp => {
      var iconGosto = document.getElementById(idVideo + "G");
      var iconNaoGosto = document.getElementById(idVideo + "N");
      var textLike = document.getElementById(idVideo + "T");

      iconGosto.style.color = "";
      iconNaoGosto.style.color = "";

      var feedback = resp.response.feedback;
      if (feedback === "true") {
        iconGosto.style.color = "red";
        textLike.textContent = "Gostei da classificaçao"

      }
      else {
        iconNaoGosto.style.color = "red"
        textLike.textContent = "Não gostei da classificaçao"

      }
    });
  }


  async atualizaFeedBack(editFeed, idFeed, idVideo) {

    const response = await fetch(`https://merapi.herokuapp.com/feedback/${idFeed}/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "x-access-token": sessionStorage.getItem("token")
      },
      body: JSON.stringify(editFeed)
    });
    await response.json().then(resp => {
      var iconGosto = document.getElementById(idVideo + "G");
      var iconNaoGosto = document.getElementById(idVideo + "N");
      var textLike = document.getElementById(idVideo + "T");

      iconGosto.style.color = "";
      iconNaoGosto.style.color = "";

      if (resp.response.feedback === true) {
        iconGosto.style.color = "red"
        textLike.textContent = "Gostei da classificaçao"
      }
      if (resp.response.feedback === null) {
        iconGosto.style.color = "";
        iconNaoGosto.style.color = "";
        textLike.textContent = "Gostou desta classificação?"

      }
      if (resp.response.feedback === false) {
        iconNaoGosto.style.color = "red";
        textLike.textContent = "Não gostei da classificaçao"

      }
    });
  }

  async adicionaFeedback(valor, id, idVideo) {
    var decoded = jwt.decode(sessionStorage.getItem('token'));
    const dadosEnviar = {
      userFK: decoded.userID,
      musicFK: id
    };
    //verificar se já foi feito um feedback à musica pelo utilizador em questão
    const response = await fetch(`https://merapi.herokuapp.com/feedback/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "x-access-token": sessionStorage.getItem("token")
      },
      body: JSON.stringify(dadosEnviar)
    });

    await response.json().then(resp => {
      var count = Object.keys(resp.response).length;
      let status = resp.status;
      switch (status) {
        case "Não existe feedback ainda para esta música":
          if (count === 0) {
            //create feedback
            const createFeed = {
              feedback: valor,
              musicFK: id,
              userFK: decoded.userID
            };
            this.createFeedBack(createFeed, idVideo);
          }
          break;
        case "Feedback listado com sucesso":

          if (count !== 0) {
            var valorFeedback = valor;

            if (valor === resp.response.feedback + "") {
              valorFeedback = null;
            }
            var editFeed = {
              feedback: valorFeedback,
              musicFK: id,
              userFK: decoded.userID
            };

            const idFeed = resp.response.id;

            this.atualizaFeedBack(editFeed, idFeed, idVideo)
          }
          break;
        case "Nao está autenticado | token expirou":
          this.refreshToken();
          this.adicionaFeedback(valor, id, idVideo);
          break;
        default: console.log("erro ao listar feedback")
      }


    })
  }

  render() {
    return (

      <div className="Inicio container">
        <div className="containerPesquisa">
          <div className="row">
            <div className="col-md-12 mb-3">
              <br />
              <h1 className="display-5 text-center">Resultados da Pesquisa:</h1>
              <hr />
            </div>
          </div>

          <AlertMsg
            text={this.state.alertText}
            isNotVisible={this.state.alertisNotVisible}
            alertColor={this.state.alertColor}
          />


          {(this.state.dataGet === "vazio") ? (
            <div className="col-md-12 mb-3">
              <h3 className="display-5 text-center">Não foram encontrados resultados para '{this.props.query}'</h3>

            </div>
          ) : (
              <div>
                {
                  this.state.dataGet.map((data, index) => {
                    return (
                      <div key={index} className="musicaPesquisa">

                        <div className="modal-dialog modal-lg">


                          <div className="modal-content">

                            <div className="modal-body mb-0 p-0">
                              {(sessionStorage.getItem('token') != null) ? (
                                (this.getRole() === true) ? (
                                  <button id={data.idVideo} type="button" style={{ float: "right" }} className="btn btn-danger" onClick={this.eliminarMusica} ><i className="fa fa-trash"></i></button>
                                ) : (<p></p>)
                              ) : (<p></p>)}
                              <center>
                                <h3>{data.nome}</h3>
                                <p>Publicado a {data.dataPublicacao}</p>
                              </center>
                              <iframe id="frame" style={{ width: "100%" }} src={"https://www.youtube.com/embed/" + data.idVideo}
                                title={data.name} autoPlay allowFullScreen></iframe>


                            </div>

                            <div className="justify-content-center">
                              <center>
                                <h2 style={{ border: "1px solid" }}>{data.emocao}</h2>

                                <div className="text-secondary" >
                                  <h6 className="text-secondary"><i >{data.numViews}</i> Visualizações </h6>
                                  <h6 id="likes"> <i className="fa fa-thumbs-o-up"></i> <i>{data.numLikes}</i></h6>
                                  <h6 id="likes"> <i className="fa fa-thumbs-o-down"></i> <i >{data.numDislikes}</i></h6>
                                </div>
                                {(sessionStorage.getItem('token') != null) ? (
                                  <div className="row">
                                    <h6 id={data.idVideo + "T"} style={{ marginLeft: "18px", marginTop: "5px" }}>Gostou desta classificação?</h6>
                                    <i onClick={() => { this.adicionaFeedback("true", data.id, data.idVideo) }} id={data.idVideo + "G"} className="fa fa-thumbs-o-up" style={{ fontSize: "25px", marginLeft: "5px", cursor: "pointer" }}></i>
                                    <i onClick={() => { this.adicionaFeedback("false", data.id, data.idVideo) }} id={data.idVideo + "N"} className="fa fa-thumbs-o-down" value="false" style={{ fontSize: "25px", marginLeft: "5px", cursor: "pointer" }}></i>
                                    <p style={{ marginLeft: "12px", marginTop: "7px" }}>Adicionar a lista de reprodução</p><button id="teste" style={{ marginLeft: "12px", borderRadius: "50%", fontSize: "20px" }} type="button" className="btn btn-danger" data-toggle="modal" data-target="#exampleModalListas" onClick={() => { this.getMusicFK(data.idVideo) }} >+</button>
                                    <div className="pt-3 py-3 text-center">
                                      <div className="modal fade" id="exampleModalListas" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                          <div className="modal-content">
                                            <div className="modal-header">
                                              <center>
                                                <h5 className="modal-title" id="exampleModalLabel">Listas de Reprodução</h5>
                                                <AlertMsg2
                                                  text={this.state.alertText}
                                                  isNotVisible={this.state.alertisNotVisible}
                                                  alertColor={this.state.alertColor}
                                                />
                                              </center>

                                              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                              </button>
                                            </div>
                                            <div className="modal-body">
                                              {
                                                this.state.dataListasReproducao.map((data2, index2) => {

                                                  return (

                                                    <div key={index2}>
                                                      <center>
                                                        <div key={index2} className="col-md-4 col-md-6">
                                                          <div className="funkyradio">
                                                            <div className="funkyradio-default">
                                                              <input type="radio" name="radio" id={"lista" + index2} />
                                                              <label for={"lista" + index2}>{data2.nomeLista}</label>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </center>
                                                    </div>

                                                  )
                                                })
                                              }
                                            </div>
                                            <div className="modal-footer">
                                              <button className="btn btn-danger" type="button" onClick={() => { this.adicionaMusicaALista() }}>Adicionar</button>
                                              <button type="button" className="btn btn-danger" data-dismiss="modal">Sair</button>
                                            </div>

                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                    <div></div>
                                  )}
                              </center>
                            </div>

                          </div>

                        </div>


                      </div>
                    )
                  })


                }
              </div>
            )}

        </div>
        <center>
          <LoadingGif
            loading={this.state.isHidden}
          />
        </center>
        <br />
      </div>

    );
  }
}

export default IndexPesquisa;

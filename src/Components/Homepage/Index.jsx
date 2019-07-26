import React, { Component } from "react";
import '../../CssComponents/index.css';
import AlertMsg from '../Global/AlertMsg';
import AlertMsg2 from '../Global/AlertMsg';

import LoadingGif from '../Global/LoadingGif';
import logo2 from '../../logo2.png'
var jwt = require('jsonwebtoken');

class Index extends Component {

  constructor() {
    super();
    this.state = {
      alertText: "",
      alertisNotVisible: true,
      alertColor: "danger",
      dataGet: [],
      dataPost: [],
      dataListasReproducao: [],
      dataMusicParaLista: [],
      isHidden: false
    }
  }

  componentDidMount() {
    this.getLastVideos();
    //this.carregaFeedbacks();
    this.setState({ loading: false })
    var filterContainer = document.getElementById('filterContainer');
    filterContainer.style.display="none";

  }
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
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
          case "Nao está autenticado | token expirou":
              this.refreshToken();
              this.listasReproducao();
              break;
  
        default:
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
        case "Nao está autenticado | token expirou":
          this.refreshToken();
          this.adicionaMusicaALista();

          break;
        default:
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

  async getLastVideos() {
    const response = await fetch('https://merapi.herokuapp.com/music', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': sessionStorage.getItem('token')
      }
    });

    await response.json().then(resp => {
      let status = resp.status;
      switch (status) {
        case "Últimas músicas classificadas":
          this.setState({ dataGet: resp.response });
          this.setState({ isHidden: true });
          var filterContainer = document.getElementById('filterContainer');
          filterContainer.style.display="block";
          if (jwt.decode(sessionStorage.getItem('token'))) {
            this.atualizaListaFeedback();
            this.listasReproducao();

          }
          break;
        case "Ainda não existem músicas na Base de Dados":
          this.setState({ isHidden: true });
          break;
        case "token expired":
          this.refreshToken();
          this.getLastVideos();
          break;
        default:
          console.log(this.state.alertText)
          break;
      }
    })
  }


  async getLastVideosEmocao(emocao) {
    this.setState({dataGet:[]})
       this.setState({ isHidden: false });
    var mostrarTudo = document.getElementById('filterMostarTudo')
    mostrarTudo.className="btn";
    var feliz = document.getElementById('filterFeliz');
    feliz.className="btn";
    var tensa = document.getElementById('filterTensa');
    tensa.className="btn";
    var triste = document.getElementById('filterTriste');
    triste.className="btn";
    var calma = document.getElementById('filterCalma');
    calma.className="btn";

    if(emocao==="MostrarTudo"){
      mostrarTudo.className="btn active";
      this.getLastVideos();

    }
    else{
      var filterEscolhido = document.getElementById("filter"+emocao);
      filterEscolhido.className="btn active" 
    
     const response = await fetch(`https://merapi.herokuapp.com/music/emocao/${emocao}`, {
       method: 'GET',
       headers: {
         'Content-Type': 'application/json',
         'x-access-token': sessionStorage.getItem('token')
       }
     });

     await response.json().then(resp => {
       
       
       let status = resp.status;
       switch (status) {
         case "Últimas músicas classificadas":
           this.setState({ dataGet: resp.response });
           this.setState({ isHidden: true });
           if (jwt.decode(sessionStorage.getItem('token'))) {
             this.atualizaListaFeedback();
             this.listasReproducao();

           }
           break;
         case "Não existe músicas com esta emoção":
           this.setState({ isHidden: true });
           var semMusicas = document.getElementById('semMusicas');
           semMusicas.textContent="Sem músicas de momento";
           semMusicas.style.fontSize="25px";
           semMusicas.style.color="white";
           break;
          case "Realizou demasiados pedidos ao servidor nos últimos minutos. Tente novamente mais tarde":
              this.setState({
                alertText: "Excedeu o número de uploads permitidos nos últimos minutos",
                alertisNotVisible: false,
                alertColor: "warning"
              });
              break;
         
         default:
          console.log(this.state.alertText)
         break;
       }
     })
    }
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

  handleSubmit = async e => {
    e.preventDefault();
    var botao = document.getElementById('idDoBotao');
    botao.style.display = "none";
    //Objeto URL
    const urlInput = document.getElementById("urlInput").value;
    var userFK = null;
    if (sessionStorage.getItem('token') === null) {
      userFK = null;
    }
    else {
      userFK = jwt.decode(sessionStorage.getItem('token')).userID;
    }

    //Objeto Login
    const uploadData = {
      urlInput: urlInput,
      userFK: userFK
    };
    const response = await fetch('https://merapi.herokuapp.com/music/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData)

    }
    );
    //Aguardar API
    await response.json().then(resp => {
      //Verificar o estado da resposta da API
      let status = resp.status;
      switch (status) {
        case "Upload":
          this.setState({ dataPost: resp.response });
          this.setState({
            alertText: "A música será classificada. Aguarde pacientemente. ",
            alertisNotVisible: false,
            alertColor: "success"
          });
          
          setTimeout(() => {
            window.location = "/music/processing/get";
            botao.style.display = "block";
          }, 3500);

          break;
        case "URL já existe na base de dados":
          this.setState({ dataPost: resp.response });
          this.setState({
            alertText: "URL já existe na base de dados",
            alertisNotVisible: false,
            alertColor: "warning"
          });
          botao.style.display = "block";
          break;
        case "Foram feitos demasiados uploads nos últimos minutos! Volte a tentar mais tarde":
          this.setState({
            alertText: "Excedeu o número de uploads permitidos nos últimos minutos",
            alertisNotVisible: false,
            alertColor: "warning"
          });
          botao.style.display = "block";
          break;
          case "Erros na validação":
              this.setState({ dataPost: resp.response });
              this.setState({
                  alertText: this.state.dataPost[0].msg,
                  alertisNotVisible: false,
                  alertColor: "warning"
              });
              botao.style.display = "block";
              break;
        default:
            botao.style.display = "block";
          console.log(this.state.alertText);
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


  render() {
    return (

      <div className="Inicio container">
        <div className="container">


          {/*URL*/}
          <form onSubmit={this.handleSubmit}>
            <br></br>
            <div>
              <center>
                <img className="imagemMER" src={logo2} alt=""></img>
              </center>
            </div>
            <div className="input-group mb-2 mr-sm-2">
              <div className="input-group-prepend">
                <div className="input-group-text">URL</div>
              </div>
              <input type="text" className="form-control py-0" id="urlInput" placeholder=" Introduza o URL " required></input>
              <div className="input-group-prepend">
                <button className="input-group-text" id ="idDoBotao">Classificar</button>
              </div>

            </div>
          </form>
          <center>
            <div id="filterContainer">
              <button id="filterMostarTudo" className="btn active" onClick={()=>{this.getLastVideosEmocao("MostrarTudo")}}> Mostrar últimas</button>
              <button id={"filterFeliz"} className="btn" onClick={()=>{this.getLastVideosEmocao("Feliz")}}> Feliz</button>
              <button id={"filterTensa"}className="btn" onClick={()=>{this.getLastVideosEmocao("Tensa")}}> Tensa</button>
              <button id={"filterCalma"} className="btn" onClick={()=>{this.getLastVideosEmocao("Calma")}}> Calma</button>
              <button id={"filterTriste"} className="btn" onClick={()=>{this.getLastVideosEmocao("Triste")}}> Triste</button>
            </div>
            {(this.state.dataGet.length===0) ? (
            <h3 id="semMusicas"> </h3>
          ):(
            <div></div>
          )}
          </center>
          <AlertMsg
            text={this.state.alertText}
            isNotVisible={this.state.alertisNotVisible}
            alertColor={this.state.alertColor}
          />
          <br />

          <center>
            <LoadingGif
              loading={this.state.isHidden}
            />
          </center>
          {/* <div className="row">
            <div className="col-md-12 mb-3">
              <h4 className="font-style-underline"> <u>Últimas músicas classificadas: </u></h4>
            </div>
            
            </div> */}
         
          {
            this.state.dataGet.map((data, index) => {
              return (
                <div key={index} className="">

                  <div className="modal-dialog modal-lg">


                    <div className="modal-content">

                      <div className="modal-body mb-0 p-0">
                        {(sessionStorage.getItem('token') != null) ? (
                          (this.getRole() === true) ? (
                          <button id={data.idVideo} type="button" style={{ float: "right" }} className="btn btn-danger" onClick={this.eliminarMusica} ><i className="fa fa-trash"></i></button>
                        ) : (<p></p>)
                        ): (<p></p>)}


                        <center>
                          <h3>{data.nome}</h3>
                          <p>Publicado a {data.dataPublicacao}</p>
                        </center>
                        <iframe id="frame" style={{ width: "100%" }} src={"https://www.youtube.com/embed/" + data.idVideo}
                          title={data.name} autoPlay allowFullScreen></iframe>


                      </div>

                      <div className="justify-content-center">
                        <center>
                          <div style={{ backgroundColor: "orange", width: "30%" }}>
                            <h2 style={{ border: "1px solid" }}>{data.emocao}</h2>
                          </div>

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
                              <p id={data.id} style={{ marginLeft: "12px", marginTop: "7px" }}>Adicionar a lista de reprodução</p><button id="teste" style={{ marginLeft: "12px", borderRadius: "50%", fontSize: "20px" }} type="button" className="btn btn-danger" data-toggle="modal" data-target="#exampleModalListas" onClick={() => { this.getMusicFK(data.idVideo) }} >+</button>
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
                                                        <label htmlFor={"lista" + index2}>{data2.nomeLista}</label>
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
      </div>

    );
  }
}

export default Index;
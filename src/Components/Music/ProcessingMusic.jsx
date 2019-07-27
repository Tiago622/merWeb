import React, { Component } from "react";
import '../../CssComponents/index.css'
import logo from '../../loading2.gif';
var jwt = require('jsonwebtoken');

class ProcessingMusic extends Component {
  constructor() {
    super();
    this.state = {
      alertText: "Ocorreu um erro técnico. Tente novamente mais tarde",
      alertisNotVisible: true,
      alertColor: "danger",
      dataMusicasProcess: [],
      isHidden: false

    }
  }
  componentDidMount() {
    this.musicasEmProcessamento();
  }
  async musicasEmProcessamento() {
    const response = await fetch(`https://merapi.herokuapp.com/music/processing/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "x-access-token": sessionStorage.getItem("token")
      }
    });
    await response.json().then(resp => {
      let status = resp.status;
      switch (status) {
        case "Não existe músicas em processamento":
          break;
        case "Músicas em processamento":
          this.setState({ dataMusicasProcess: resp.response })

          break;
        default:

      }
    });
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
    if (this.state.dataMusicasProcess.length === 0) {
      return (
        <div className="Inicio container">
          <div className="containerPesquisa">
            <div className="row">
              <div className="col-md-12 mb-3">
                <br />
                <br />
                <h1 className="display-5 text-center">De momento não existem músicas em processamento!</h1>
                <hr />
              </div>
            </div>
          </div>
        </div>
      )
    }
    else {
      return (

        <div className="Inicio container">
          <div className="containerPesquisa">
            <div className="row">
              <div className="col-md-12 mb-3">
                <br />
                <br />
                <h1 className="display-5 text-center">Músicas em processamento:</h1>
                <hr />
              </div>
            </div>
          </div>
          {
            this.state.dataMusicasProcess.map((data, index) => {
              return (
                <div key={index} className="musicaPesquisa">

                  <div className="modal-dialog modal-lg">


                    <div className="modal-content">

                      <div className="modal-body mb-0 p-0">

                        <center>
                          <h3>{data.name}</h3>
                        </center>
                        <iframe id="frame" style={{ width: "100%" }} src={"https://www.youtube.com/embed/" + data.idVideo}
                          title={data.name} autoPlay allowFullScreen></iframe>


                      </div>

                      <center>
                        <h3>Música está a ser classificada. Por favor aguarde. </h3>
                        <img
                          src={logo}
                          width="100"
                          height="100"
                          className="d-inline-block align-top"
                          alt="Ícone"
                        />
                      </center>
                    </div>

                  </div>
                </div>
              )
            })


          }

        </div>
      )
    }

  }


}

export default ProcessingMusic;
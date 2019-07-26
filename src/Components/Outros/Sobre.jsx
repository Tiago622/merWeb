import React, { Component } from "react";
import '../../CssComponents/sobre.css'
class Sobre extends Component {
  render() {
    return (

      <div className="Inicio container">
        <div className="containerPerfil">
          <div className="row">
            <div className="col-md-12 mb-3">
              <h1 className="display-3 text-center">Sobre</h1>
            </div>
          </div>
          <br />

          <div className="row">
            <center>
            {/*IMAGEM*/}
            <div>
              <img id="imagem" src="../../logo.png" alt="" width="250" />
            </div>

            {/*INFORMAÇÃO*/}
            <div id="inf" className="text-justify">
              <p>
                Desde há muitos séculos que a música interliga as pessoas, e com o evoluir da tecnologia, vão surgindo alguns websites relacionados ao assunto.
              </p>
              <p>
                Estas aplicações têm como principal objetivo permitir aos utilizadores ouvir músicas de acordo com as suas preferências, mais precisamente, por categorias.
              </p>
              <p>
                No entanto, porque não classificar as músicas por aquilo que elas na verdade transmitem, ou seja, classificar as mesmas por nível de emoção.
              </p>
              <p>
                Existem centenas de categorias de música diferentes, desde Pop, Rock, Jazz. Porém dentro destas categorias, o nível de emoção pode diferenciar, já que podemos ter uma música triste e alegre dentro da mesma categoria.
               </p>
              <p>
                Portanto, a implementação de uma aplicação web, com o intuito de permitir caracterizar músicas pela emoção que ela transmite, seria algo novo e que iria revolucionar a forma como as pessoas pesquisam as suas músicas.
              </p>

            </div>
            </center>
          </div>

        </div>
      </div>
    );
  }
}

export default Sobre;
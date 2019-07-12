import React, { Component } from 'react';
// import Header from '../Components/Globais/Header';
// import Footer from '../Components/Globais/Footer';
import IndexPesquisa from '../../Components/Music/IndexPesquisa';
import Footer from '../../Components/Global/footer';
import Header from '../../Components/Global/header';
class IndexPesquisaPage extends Component {
    render() {
      return (
        <div>
          <Header/>
          <IndexPesquisa query={this.props.query}/>
          <Footer/>

        </div>
      );
    }
  }

export default IndexPesquisaPage;
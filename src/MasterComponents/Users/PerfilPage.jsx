import React, { Component } from 'react';
import Perfil from '../../Components/Users/Perfil';
import Footer from '../../Components/Global/footer';
import Header from '../../Components/Global/header';

class PerfilPage extends Component {
    render() {
      return (
        <div>
          <Header/>
          <Perfil/>
          <Footer/>

        </div>
      );
    }
  }

export default PerfilPage;
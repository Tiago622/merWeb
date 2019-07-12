import React, { Component } from 'react';
import Sobre from '../../Components/Outros/Sobre';
import Footer from '../../Components/Global/footer';
import Header from '../../Components/Global/header';
class SobrePage extends Component {
    render() {
      return (
        <div>
          <Header/>
          <Sobre/>
          <Footer/>

        </div>
      );
    }
  }

export default SobrePage;
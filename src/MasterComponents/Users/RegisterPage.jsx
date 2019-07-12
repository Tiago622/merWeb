import React, { Component } from 'react';
// import Header from '../Components/Globais/Header';
// import Footer from '../Components/Globais/Footer';
import Register from '../../Components/Users/Register';
import Footer from '../../Components/Global/footer';
import Header from '../../Components/Global/header';
class RegisterPage extends Component {
    render() {
      return (
        <div>
          <Header/>
          <Register/>
          <Footer/>

        </div>
      );
    }
  }

export default RegisterPage;
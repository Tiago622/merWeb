import React, { Component } from 'react';
// import Header from '../Components/Globais/Header';
// import Footer from '../Components/Globais/Footer';
import Login from '../../Components/Users/Login';
import Footer from '../../Components/Global/footer';
import Header from '../../Components/Global/header';
class LoginPage extends Component {
    render() {
      return (
        <div>
          <Header/>
          <Login/>
          <Footer/>

        </div>
      );
    }
  }

export default LoginPage;
import React, { Component } from 'react';
import Index from '../Components/Homepage/Index';
import Footer from '../Components/Global/footer';
import Header from '../Components/Global/header';
class IndexPage extends Component {
    render() {
      return (
        <div>
          <Header/>
          <Index/>
          <Footer/>

        </div>
      );
    }
  }

export default IndexPage;
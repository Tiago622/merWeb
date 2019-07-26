import React, { Component } from 'react';
// import Header from '../Components/Globais/Header';
// import Footer from '../Components/Globais/Footer';
import ProcessingMusic from '../../Components/Music/ProcessingMusic';
import Footer from '../../Components/Global/footer';
import Header from '../../Components/Global/header';
class ProcessingMusicPage extends Component {
    render() {
      return (
        <div>
          <Header/>
          <ProcessingMusic query={this.props.query}/>
          <Footer/>

        </div>
      );
    }
  }

export default ProcessingMusicPage;
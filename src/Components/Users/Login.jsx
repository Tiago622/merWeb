import React, { Component } from "react";
import '../../CssComponents/Users/login.css';
import logo from '../../logo.png';
import AlertMsg from '../Global/AlertMsg';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      alertText: '',
      alertisNotVisible: true,
      alertColor: 'danger'
    };
    this.changeStatus = this.changeStatus.bind(this);
  }

  //Altera o estado conforme o Alert
  changeStatus() {
    this.setState({ alertisNotVisible: true });
  }

  handleSubmit = async e => {
    e.preventDefault();

    //Objeto Login
    const loginData = {
      username: document.getElementById('username').value,
      hashPassword: document.getElementById('password').value
    };

    //Enviar pedidos
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    //Aguardar API
    await response.json().then(resp => {
      //Verificar o estado da resposta da API
      let status = resp.status;
      switch (status) {
        case "Username ou password errados":
          this.setState({
            alertText: "Utilizador ou palavra-passe erradas",
            alertisNotVisible: false,
            alertColor: "warning"
          });
          break;
        case "Autenticado":
          //console.log(resp);
          sessionStorage.setItem('token', resp.token);
          window.location = '/';
          break;
        case 
          "Realizou demasiadas autenticações na última hora. Tente novamente mais tarde":
          this.setState({
            alertText: "Excedeu o número de autenticações.Volte a tentar mais tarde",
            alertisNotVisible: false,
            alertColor: "warning"
          });
          break;
        default:
          console.log("erro");
          break;
      }
    });
  };

  render() {
    return (

      <div className="container h-100">
        <h1 className="titleLogin">Efetue login:</h1>
        <div className="d-flex justify-content-center h-100">
          <div className="user_card">
          <div className="d-flex justify-content-center">
              <div className="brand_logo_container">
                <img src={logo} className="brand_logo" alt="Logo"></img>
              </div>
            </div>

            <div className="d-flex justify-content-center form_container">
              <form onSubmit={this.handleSubmit}>
                <div className="input-group mb-3">
                  <div className="input-group-append">
                    <span className="input-group-text"><i className="fa fa-user"></i></span>
                  </div>
                  <input id="username" type="text" name="" className="form-control input_user" placeholder="username" required></input>
                </div>
                <div className="input-group mb-2">
                  <div className="input-group-append">
                    <span className="input-group-text"><i className="fa fa-key"></i></span>
                  </div>
                  <input id="password" type="password" name="" className="form-control input_pass" placeholder="password" required></input>
                </div>
                <div className="form-group">
                  <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id="customControlInline"></input>
                    <label className="custom-control-label" htmlFor="customControlInline">Remember me</label>
                  </div>
                </div>
                <div className="d-flex justify-content-center mt-3 login_container">
                  <button type="submit" name="button" className="btn login_btn">Login</button>
                  
                </div>
                <AlertMsg
            text={this.state.alertText}
            isNotVisible={this.state.alertisNotVisible}
            alertColor={this.state.alertColor}
          />            
              </form>
             
            </div>
            {/*<div className="mt-4">
					<div className="d-flex justify-content-center links">
						Ainda não tem conta? <a href="http://localhost:3000/registar" className="ml-2">Registar</a>
					</div>
					<div className="d-flex justify-content-center links">
						<a href="#">Esqueceu-se da password?</a>
					</div>
				</div>
    */}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

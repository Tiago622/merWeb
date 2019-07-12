import React, { Component } from "react";
import '../../CssComponents/header.css';
import logo from '../../logo.png';
var jwt = require('jsonwebtoken');
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            //Dados da musica pesquisada
            dataGetSearh: []

        }

    }
    getName() {
        try {
            var decoded = jwt.decode(sessionStorage.getItem('token'));
            var name = decoded.nome;
            return name;
        } catch (err) {
            sessionStorage.clear();
            window.location = "/";
        }
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
    logout() {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
    }

    async refreshToken() {
        var decoded = jwt.decode(sessionStorage.getItem('token'));
        var nome = decoded.nome;
        var isAdmin = decoded.isAdmin;
        var username = decoded.username;
        const dataToken = {
            username,
            nome,
            isAdmin
        }
        const response = await fetch('http://localhost:8000/token/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToken)
        });

        await response.json().then(resp => {
            //Verificar o estado da resposta da API
            let status = resp.status;
            switch (status) {
                case "Token Atualizado":
                    sessionStorage.clear();
                    sessionStorage.setItem('token', resp.response);
                    break;

                default:
                    window.location = "/"
            }
        });
    }

    getSearch = async e => {
        e.preventDefault();

        const pesquisaMusica = document.getElementById('searchMusicas').value;

        const response = await fetch(`http://localhost:8000/music/search/${pesquisaMusica}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        //Aguardar API
        await response.json().then(resp => {
            //Verificar o estado da resposta da API
            const datalistSearch = document.getElementById('musics');
            this.setState({ dataGetSearh: resp.response })
            let numMusicas = this.state.dataGetSearh.length;
            datalistSearch.textContent = "";
            for (let i = 0; i < numMusicas; i++) {
                const option = document.createElement('option');
                option.setAttribute('id', this.state.dataGetSearh[i].idVideo);
                option.setAttribute('value', this.state.dataGetSearh[i].name);
                datalistSearch.append(option);
            }
        });
    }

    
    handleSubmitOnSubmit = async e => {

        e.preventDefault();

        const pesquisaMusica = document.getElementById('searchMusicas').value;
        window.location = "/music/pesquisa/" + pesquisaMusica

        // const response = await fetch(`http://localhost:8000/music/search/${pesquisaMusica}`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'x-access-token': sessionStorage.getItem('token')
        //     },
        // });
        // //Aguardar API
        // await response.json().then(resp => {
        //     //console.log(resp.status);
        //     //Verificar o estado da resposta da API
        //     let status = resp.response.length;
        //     //console.log(resp.response.length);
        //     this.state.data = resp;
        //     //console.log(this.state.data)

        //     switch (status) {
        //         case 0:
        //             break;
        //         case undefined:
        //             break;
        //         default:
        //             console.log(resp)
        //             //window.history.pushState(resp, '', '/music/pesquisa')
        //     }

        // });

    }
    render() {

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-warning">
                <a className="navbar-brand" href="/" style={{ paddingLeft: '35px' }}>
                    <img
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="Ícone"
                    />
                    {" "}MER
                    </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav mr-auto" id="head">

                        <li className="nav-item active">
                            <span className="nav-link"> | </span>
                        </li>


                        {/*SOBRE*/}
                        <li className="nav-item active">
                            <a className="nav-link" href="/sobre">Sobre <span className="sr-only">(current)</span></a>
                        </li>

                        <li className="nav-item active">
                            <span className="nav-link"> | </span>
                        </li>

                        {
                            (() => {
                                if (sessionStorage.getItem('token') != null) {
                                    if (this.getRole() === true) {
                                        return (
                                            <div className="collapse navbar-collapse" id="navbarText">
                                                <li className="nav-item active">
                                                    <a className="nav-link" href="http://localhost:8000/api/doc">Documentação da API <span className="sr-only">(current)</span></a>
                                                </li>
                                                <li className="nav-item active">
                                                    <span className="nav-link"> | </span>
                                                </li>
                                            </div>
                                        )
                                    }
                                }
                            })()

                        }
                        {/*CRIAR NOVOS UTILZIADORES | LISTAR*/}
                        {
                            (() => {
                                if (sessionStorage.getItem('token') != null) {
                                    if (this.getRole() === true) {
                                        return (
                                            <li id="users" className="nav-item dropdown">
                                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Utilizadores
                                                </a>
                                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                                    <a className="dropdown-item" href="/utilizadores"><i className="fa fa-th-list"></i> Listar</a>
                                                    <a className="dropdown-item" href="/registar"><i className="fa fa-plus"></i> Registar</a>
                                                </div>
                                            </li>
                                        )
                                    }
                                }

                            })()
                        }

                    </ul>


                    {/* <form class="form-inline my-2 my-lg-0" onChange={this.handleSubmitOnChange} onSubmit={this.handleSubmitOnSubmit}>
                        <input id="searchMusicas" class="form-control mr-sm-2" type="search" placeholder="Pesquisa Músicas" aria-label="Search" list="musics"></input>
                        <button class="btn btn-outline-danger my-2 my-sm-0" type="search">Search</button>
                    </form> */}
                    <i className="fa fa-search" data-toggle="modal" data-target="#exampleModal" style={{ fontSize: '20px', cursor: "pointer" }}></i>
                    <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Procura</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form onChange={this.getSearch} onSubmit={this.handleSubmitOnSubmit}>
                                        <input id="searchMusicas" className="form-control mr-sm-2" type="search" placeholder="Pesquisa Músicas" aria-label="Search" list="musics"></input>
                                        <datalist id="musics"></datalist>

                                        <div className="modal-footer">
                                            <button className="btn btn-danger" type="search">Search</button>
                                            <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*INICIAR SESSÃO*/}
                    {(sessionStorage.getItem('token') == null) ? (
                        <li className="navbar-text" id="head">
                            <a className="nav-link" href="/login">Iniciar Sessão</a>
                        </li>
                    ) : ([
                        <div key="sessaoIniciada" id="head">
                            <li className="navbar-text">
                                <a className="nav-link" href="/perfil"> {this.getName()}</a>
                            </li>
                            <li className="navbar-text">
                                <button className="btn btn-sm btn-secondary" type="button" onClick={this.logout}>Terminar Sessão</button>
                            </li>
                        </div>
                    ]
                        )}

                    {/* <li className="navbar-text">
                            <a className="nav-link" href="#">Registar</a>
                        </li> */}

                </div>
            </nav>
        );
    }
}


//{condição ?(

//):(

//)}


export default Header;
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import IndexPage from '../src/MasterComponents/IndexPage';
import LoginPage from '../src/MasterComponents/Users/LoginPage';
import NotFindPage from './Components/Global/NotFindPage';
import RegisterPage from './MasterComponents/Users/RegisterPage';
import PerfilPage from './MasterComponents/Users/PerfilPage'
import IndexPesquisaPage from './MasterComponents/Music/IndexPesquisaPage';
import SobrePage from './MasterComponents/Outros/SobrePage';
import UsersPage from './MasterComponents/Users/IndexPage';
import ProcessingMusicPage from './MasterComponents/Music/ProcessingMusicPage'

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            {/*GLOBAIS*/}
            <Route path="/" exact={true} component={IndexPage} />
            <Route path="/sobre" component={SobrePage} />

            {/*UTILIZADORES*/}
            <Route path="/login" component={LoginPage} />
            <Route path="/registar" component={RegisterPage} />
            <Route path="/perfil" component={PerfilPage} />
            <Route path="/utilizadores" component={UsersPage} />


            {/*MUSICAS*/}
            <Route path="/music/pesquisa/:query" component={(r) => <IndexPesquisaPage query={r.match.params.query} />} />
            <Route path="/music/processing" component={ProcessingMusicPage} />

            <Route path='*' component={NotFindPage} />

        </Switch>
    </ BrowserRouter>
    , document.getElementById('root')
);

serviceWorker.unregister();
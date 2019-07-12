import React, { Component } from "react";
import logo from '../../loading.gif';

class AlertMsg extends Component {

    constructor(props) {
        super(props);
        this.hid = this.hid.bind(this);
    }

    changeStatus() {
        this.props.status();
    }

    /**
     * Método que apresentada/esconde o alert
     */
    hid() {
        if (this.props.status !== undefined)
            this.changeStatus();
        document.getElementById("adeus").hidden = true;
    }


    render() {
        return (
            <div>
                <img
                    src={logo}
                    width="250"
                    height="250"
                    alt="Ícone"
                    hidden={this.props.loading}
                />
            </div>
        );
    }
}

export default AlertMsg;

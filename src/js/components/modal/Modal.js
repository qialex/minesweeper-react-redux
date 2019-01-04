// src/js/components/Modal.js
import React, {Component} from "react";
import { Route } from "react-router-dom";
import Settings from "../settings/Settings";
import Records from "../records/Records";
import './modal.scss';


class Modal extends Component {

    _goToHomePage() {

        // redirect back to game
        this.props.history.push({
            pathname: '/',
            state: {
                from: this.props.location.pathname
            }
        });
    }

    constructor() {

        super();

        this.handleClose = this.handleClose.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    handleClickOutside(event) {

        // if clicked outside
        if (event.nativeEvent.target.classList.contains('modal-wrapper')) {

            // redirect back to game
            this._goToHomePage();
        }
    }

    handleClose() {

        // redirect back to game
        this._goToHomePage();
    }

    render() {
        return (
            <div className="modal-wrapper" onMouseDown={this.handleClickOutside}>
                <div className="modal-content">
                    <div className="settings-panel-close" onClick={this.handleClose}>
                    </div>
                    <Route path="/modal/settings/" render={() => <Settings onClose={this.handleClose} />} />
                    <Route path="/modal/records/"  render={() => <Records  onClose={this.handleClose} />} />
                </div>
            </div>
        );
    }
}
export default Modal;

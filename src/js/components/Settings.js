// src/js/components/Settings.js
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { changeSettings } from "../actions/index";
const mapDispatchToProps = dispatch => {
    return {
        changeSettings: settings => dispatch(changeSettings(settings)),
    };
};
class ConnectedSettings extends Component {
    constructor() {
        super();
        this.state = {
            x: '',
            y: '',
            bombs: '',
            isCustomSettings: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        if (this.props.article) {
            const { title } = this.props.article;
            this.setState({ title });
        }
    }
    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }
    handleSubmit(event) {
        event.preventDefault();
        let { x, y, bombs } = this.state;
        x = +x;
        y = +y;
        bombs = +bombs;
        if (!x || x < 8 || x > 32) {
            return
        }
        if (!y || y < 8 || y > 32) {
            return
        }
        if (!bombs || bombs < 1 || bombs > x*y / 3) {
            return
        }

        this.props.changeSettings({x, y, bombs});
        this.props.handleSettingsSet();
    }
    handleNewGameClick(x, y, bombs) {
        console.log (this.props);
        this.props.changeSettings({x, y, bombs});
        this.props.handleSettingsSet();
    }
    handleCustomSettings() {
        this.setState({isCustomSettings: !this.state.isCustomSettings});
    }
    render() {
        const { isCustomSettings } = this.state;
        const { x, y, bombs } = this.state;
        return (
            <div>
                <button className="btn btn-success btn-lg" onClick={this.handleNewGameClick.bind(this, 8, 8, 10)}>
                    8*8 10
                </button>
                <button className="btn btn-success btn-lg" onClick={this.handleNewGameClick.bind(this, 16, 16, 40)}>
                    16*16 40
                </button>
                <button className="btn btn-success btn-lg" onClick={this.handleNewGameClick.bind(this, 16, 30, 99)}>
                    16*30 99
                </button>
                <button className="btn btn-success btn-lg" onClick={this.handleCustomSettings.bind(this)}>
                    Custom
                </button>
                { isCustomSettings && (
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">X</label>
                            <input
                                type="text"
                                className="form-control"
                                id="x"
                                value={x}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="title">Y</label>
                            <input
                                type="text"
                                className="form-control"
                                id="y"
                                value={y}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="title">Bombs</label>
                            <input
                                type="text"
                                className="form-control"
                                id="bombs"
                                value={bombs}
                                onChange={this.handleChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-success btn-lg">
                            SAVE
                        </button>
                    </form>
                )}
            </div>
        );
    }
}
const Settings = connect(null, mapDispatchToProps)(ConnectedSettings);
export default Settings;
// src/js/components/settings/Settings.js
import React, { Component } from "react";
import { connect } from "react-redux";
import { changeGameSettings } from "../../actions/index";
import {Redirect} from "react-router-dom";
import L from "../../localization/Localization";
import LanguageSelect from "./components/language-select/LanguageSelect";
import Slider from "./components/slider/Slider";
import './settings.scss';
import GameSettings from "../../models/GameSettings";


const mapStateToProps = state => {

    return { gameSettings: {...state.gameSettings} };
};

const mapDispatchToProps = dispatch => {

    return {
        changeGameSettings: settings => dispatch(changeGameSettings(settings)),
    };
};

export class ConnectedSettings extends Component {

    _isDisplayCustomSettings() {

        const { selectedPreset } = this.state;

        // determine custom settings
        return selectedPreset && !selectedPreset.props;
    }

    _goToHomePage() {

        // redirect back to game
        this.setState({toHomePage: true})
    }

    constructor() {

        super();

        this.state = {
            gameSettings: undefined,
            toHomePage: false,
            selectedPreset: undefined,
        };

        this._goToHomePage = this._goToHomePage.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleRadioChanged = this.handleRadioChanged.bind(this);
    }

    componentWillMount() {

        const gameSettings = new GameSettings(this.props.gameSettings);


        // setting gameSettings and selectedPreset
        this.setState({gameSettings: gameSettings, selectedPreset: gameSettings.preset});
    }

    handleSave() {

        const { gameSettings } = this.state;

        // saving gameSettings
        this.props.changeGameSettings(gameSettings.props);

        // redirect back to game
        this._goToHomePage();
    }

    handleClickOutSide(event) {

        // if clicked outside
        if (event.nativeEvent.target.classList.contains('setting-wrapper')) {

            // redirect back to game
            this._goToHomePage();
        }
    }

    handleValueChanged(property, value) {

        // doing new values set
        const props = {...this.state.gameSettings.props, [property]: value};

        // new gameSettings
        const newGameSettings = new GameSettings(props);

        // checking validation
        const validation = newGameSettings.validation;

        if (!validation.length) {

            // saving gameSettings if values are valid
            this.setState({gameSettings: newGameSettings});

        } else {

            // looping invalid props
            validation.map(report => {

                // setting values in min max range
                props[report.prop] = Math.min(props[report.prop], report.max);
                props[report.prop] = Math.max(props[report.prop], report.min);
            });

            // saving gameSettings with validated props
            this.setState({gameSettings: new GameSettings(props)});
        }
    }

    handleRadioChanged(preset) {

        // getting newProps from preset
        const newProps = preset.props;

        if (newProps) {

            // saving new props and selected preset
            this.setState({gameSettings: new GameSettings(newProps), selectedPreset: preset});
        } else {

            // if custom settings saving just radio button selection
            this.setState({selectedPreset: preset});
        }
    }

    render() {

        if (this.state.toHomePage === true) {

            // redirect back to the game
            return <Redirect to='/' />
        }

        const { gameSettings, selectedPreset } = this.state;

        // radio options
        const radioOptions = gameSettings.presets.map(preset => {

            const checked = selectedPreset.code === preset.code;

            const props = preset.props ? Object.values(preset.props) : preset.props;

            return (
                <div className="form-group" key={preset.code}>
                    <div className="container">
                        <label>
                            <input
                                name="gameSettings"
                                type="radio"
                                checked={checked}
                                onChange={() => {this.handleRadioChanged(preset)}} />

                            {L[preset.L_key]} {props && (
                                <span className="no-capitalize">— <b>{props[0]}</b>x<b>{props[1]}</b>, {L['settings_field_bombs_count']}: <b>{props[2]}</b></span>
                                )}

                            <span className="checkmark"></span>
                        </label>
                    </div>
                </div>
            )
        });

        // sliders for the custom settings
        const sliders = this._isDisplayCustomSettings() && gameSettings.publicProps.map(prop => {

            const minmax = gameSettings.minmax[prop.code];

            return (
                <div className="form-group" key={prop.code}>
                    <label>{L[prop.L_key]}</label>
                    <Slider
                        min={minmax.min}
                        max={minmax.max}
                        value={gameSettings['_' + prop.code]}
                        onValueChanged={this.handleValueChanged.bind(this, prop.code)} />
                </div>
            )
        });

        return (
            <div className="setting-wrapper" onMouseDown={this.handleClickOutSide.bind(this)}>
                <div className="setting-panel">
                    <div className="settings-panel-close"  onClick={this._goToHomePage}>
                    </div>
                    <div className="language-wrapper">
                        <LanguageSelect />
                    </div>
                    <div className="radio-buttons-wrapper">
                        {radioOptions}
                    </div>
                    <div className="sliders-wrapper">
                        {sliders}
                    </div>
                    <div className="buttons-group">
                        <button onClick={this._goToHomePage}>
                            {L.close}
                        </button>
                        <button className="button-green" onClick={this.handleSave}>
                            {L.save}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
const Settings = connect(mapStateToProps, mapDispatchToProps)(ConnectedSettings);
export default Settings;
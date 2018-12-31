// src/js/components/settings/LanguageSelect.js
import React, { Component } from "react";
import { connect } from "react-redux";
import { globalChangeLanguage } from "../../../../actions/index";
import L from "../../../../localization/Localization";
import './languageSelect.scss';


const mapStateToProps = state => {
    return { language: state.globalSettings.language };
};

const mapDispatchToProps = dispatch => {
    return {
        globalChangeLanguage: language => dispatch(globalChangeLanguage(language)),
    };
};

export class ConnectedLanguageSelect extends Component {

    _reduxGlobalChangeLanguage(language) {

        // setting language in global settings to re-render related components
        this.props.globalChangeLanguage(language);
    }

    constructor(){

        super();

        this.handleLanguageChanged = this.handleLanguageChanged.bind(this);
    }

    handleLanguageChanged(event) {

        // selected language abbreviation
        const language = event.target.value;

        // setting language in global settings to re-render related components
        this._reduxGlobalChangeLanguage(language);
    }

    render() {

        const { language } = this.props;

        const languages = L.getAvailableLanguages();

        // doing options for select
        const options = languages.map(lang => {
            return <option key={lang} value={lang}>{L._props[lang].thisLanguage}</option>;
        });

        return (
            <div className="setting-language">
                <select defaultValue={language} onChange={this.handleLanguageChanged}>
                    {options}
                </select>
            </div>
        )
    }
}

const LanguageSelect = connect(mapStateToProps, mapDispatchToProps)(ConnectedLanguageSelect);
export default LanguageSelect;
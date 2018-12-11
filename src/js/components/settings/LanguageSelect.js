// src/js/components/settings/LanguageSelect.jsect.js
import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import {globalChangeLanguage} from "../../actions/index";
import L from "../../localization/Localization";


const mapStateToProps = state => {
    return { language: state.globalSettings.language };
};

const mapDispatchToProps = dispatch => {
    return {
        globalChangeLanguage: language => dispatch(globalChangeLanguage(language)),
    };
};

class ConnectedLanguageSelect extends Component{

    constructor(){

        super();

        this.handleLanguageChanged = this.handleLanguageChanged.bind(this);
    }

    handleLanguageChanged(event) {

        // selected language abbreviation
        const language = event.target.value;

        // setting language in global settings to re-render related components
        this.props.globalChangeLanguage(language);
    }

    render() {

        const languages = L.getAvailableLanguages();
        const defaultValue = L.getLanguage();

        // doing options for select
        const options = languages.map(lang => {
            return <option key={lang} value={lang}>{L._props[lang].thisLanguage}</option>;
        });

        return (
            <div className="setting-language">
                <select defaultValue={defaultValue} onChange={this.handleLanguageChanged}>
                    {options}
                </select>
            </div>
        )
    }
}

const LanguageSelect = connect(mapStateToProps, mapDispatchToProps)(ConnectedLanguageSelect);
export default LanguageSelect;
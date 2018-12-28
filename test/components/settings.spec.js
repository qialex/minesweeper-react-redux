// test/components/languageSelect.spec.js
import React, {Component} from "react";
import configureStore from 'redux-mock-store'
import sinon from 'sinon';
import { shallow } from '../enzyme';
import Settings, { ConnectedSettings } from "../../src/js/components/settings/Settings";
import stateInitial from '../../src/js/constants/state';
import L from "../../src/js/localization/Localization";
import GameSettings from "../../src/js/models/GameSettings";
import LanguageSelect, { ConnectedLanguageSelect } from "../../src/js/components/settings/components/language-select/LanguageSelect";

describe('Component: Settings, ConnectedSettings',()=>{

    // setting spy on changeGameSettings
    // const changeGameSettingsSpy = sinon.spy(ConnectedSettings.prototype, "changeGameSettings");

    // creating mock store
    const mockStore = configureStore([])(stateInitial);

    // creating mock store
    const gameSettings = new GameSettings(stateInitial.gameSettings);

    // declaring wrapper, component
    let wrapper, component;

    beforeEach(()=>{

        // wrapping LanguageSelect
        wrapper = shallow(<Settings store={mockStore} />);

        // getting component
        component = wrapper.dive();
    });

    it('renders the component', () => {

        // should contain one ConnectedLanguageSelect
        expect(wrapper.find(ConnectedSettings)).toHaveLength(1);

        // should contain one div.setting-wrapper .setting-panel
        expect(component.find('.setting-wrapper').find('.setting-panel')).toHaveLength(1);

        // should contain one .settings-panel-close
        expect(component.find('.settings-panel-close')).toHaveLength(1);

        // should contain one .settings-panel-close
        expect(component.find('.language-wrapper').find(LanguageSelect)).toHaveLength(1);

        // should contain one .settings-panel-close
        expect(component.find('.radio-buttons-wrapper')).toHaveLength(1);

        // should contain one .settings-panel-close
        expect(component.find('.sliders-wrapper')).toHaveLength(1);

        // should contain one .settings-panel-close
        expect(component.find('.buttons-group').find('button')).toHaveLength(2);



        // // should contain one select
        // expect(component.find('select')).toHaveLength(1);
        //
        // // should contain as much options as we have languages in L
        // expect(component.find('option')).toHaveLength(L.getAvailableLanguages().length);
    });
    //
    // it('should have valid props', () => {
    //
    //     // should have language prop, equal to stateInitial
    //     expect(wrapper.prop('language')).toEqual(stateInitial.globalSettings.language);
    //
    //     // should be similar selected option to props.language
    //     expect(component.find('select').props().defaultValue).toEqual(wrapper.prop('language'));
    //
    //     // should have globalChangeLanguage prop
    //     expect(wrapper.prop('globalChangeLanguage')).toBeDefined();
    //
    //     // should be a function
    //     expect(typeof wrapper.prop('globalChangeLanguage')).toBe('function');
    // });
    //
    // it('should call handleLanguageChanged prop with correct value', () => {
    //
    //     // creating mock event
    //     const event = {
    //         target: { value: 'the-value' }
    //     };
    //
    //     // firing event on select
    //     component.find('select').simulate('change', event);
    //
    //     // handleLanguageChangedSpy should be called once
    //     expect(handleLanguageChangedSpy.calledOnce).toBeTruthy();
    //
    //     // with parameter equal to mock event
    //     expect(handleLanguageChangedSpy.calledWith(event)).toBeTruthy();
    // });
});
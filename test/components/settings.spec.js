// test/components/settings.spec.js
import React from "react";
import { Redirect } from "react-router-dom";
import configureStore from 'redux-mock-store'
import sinon from 'sinon';
import { shallow } from '../_setup/enzyme';
import Settings, { ConnectedSettings } from "../../src/js/components/settings/Settings";
import stateInitial from '../../src/js/constants/state';
import GameSettings from "../../src/js/models/GameSettings";
import LanguageSelect  from "../../src/js/components/settings/components/language-select/LanguageSelect";
import Slider from "../../src/js/components/settings/components/slider/Slider";


describe('Component: Settings, ConnectedSettings',()=>{

    // setting spy on _reduxChangeGameSettings
    const _reduxChangeGameSettingsSpy = sinon.spy(ConnectedSettings.prototype, "_reduxChangeGameSettings");

    // creating mock store
    const mockStore = configureStore([])(stateInitial);

    // creating mock store
    const gameSettings = new GameSettings(stateInitial.gameSettings);

    // declaring wrapper, component
    let wrapper, component;

    beforeEach(()=>{

        // wrapping Settings
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

        // should contain one .language-wrapper
        expect(component.find('.language-wrapper').find(LanguageSelect)).toHaveLength(1);

        // should contain one .radio-buttons-wrapper
        expect(component.find('.radio-buttons-wrapper')).toHaveLength(1);

        // should contain one .sliders-wrapper
        expect(component.find('.sliders-wrapper')).toHaveLength(1);

        // should contain one .buttons-group and two buttons inside it
        expect(component.find('.buttons-group').find('button')).toHaveLength(2);

        // should contain .preset-radio-button as much as presets.length
        expect(component.find('.preset-radio-button')).toHaveLength(gameSettings.presets.length);
    });

    describe('radio buttons', () => {

        it('change gameSettings and selectedPreset properly, display or not Slider', () => {

            // looping radio buttons
            component.find('.preset-radio-button').map((presetRadioButton, i) => {

                // simulating click on radio button
                presetRadioButton.find('input').props().onChange();

                // selectedPreset should be equal to the related gameSettings.presets
                expect(component.state().selectedPreset).toEqual(gameSettings.presets[i]);

                if (!gameSettings.presets[i].props) {

                    const sliders = component.find('.sliders-wrapper').find(Slider);

                    // should display Slider if there is no props in preset
                    expect(sliders).toHaveLength(gameSettings.publicProps.length);

                    sliders.map((slider, j) => {

                        const min = slider.props().min;

                        // simulating changing value by slider (invalid value)
                        slider.props().onValueChanged(min - 1);

                        // related settings value should be min
                        expect(Object.values(component.state().gameSettings.props)[j]).toBe(min);

                        // simulating changing value by slider (valid value)
                        slider.props().onValueChanged(min + 1);

                        // related settings value should be min + 1
                        expect(Object.values(component.state().gameSettings.props)[j]).toBe(min + 1);
                    });
                }
            });
        });
    });

    describe('click outside and close button', () => {

        it('click outside should redirect back back to the game', () => {

            let returnTrue = false;

            // creating mock event. as for now this event is for inside mouse down, so redirect should happen
            const event = { nativeEvent: { target: { classList: {contains: () => returnTrue}}}};

            // firing event on .setting-wrapper
            component.find('.setting-wrapper').props().onMouseDown(event);

            // should not invoke Redirect
            expect(component.find(Redirect)).toHaveLength(0);

            // changing event to meet redirect requirements
            returnTrue = true;

            // again firing event on .setting-wrapper
            component.find('.setting-wrapper').props().onMouseDown(event);

            // should invoke Redirect
            expect(component.find(Redirect)).toHaveLength(1);
        });

        it('close button should redirect back back to the game', () => {

            // firing click on .button-close
            component.find('.button-close').simulate('click');

            // should invoke Redirect
            expect(component.find(Redirect)).toHaveLength(1);
        });
    });

    describe('save button', () => {

        it('should update settings and redirect back to the game', () => {

            // firing click on .button-green
            component.find('.button-green').props().onClick();

            // handleSaveSpy should be called once
            expect(_reduxChangeGameSettingsSpy.calledOnce).toBeTruthy();

            // with parameter equal to mock event
            expect(_reduxChangeGameSettingsSpy.calledWith(gameSettings.props)).toBeTruthy();
        });
    });
});
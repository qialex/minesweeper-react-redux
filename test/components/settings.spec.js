// test/components/settings.spec.js
import React from "react";
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
    const onCloseSpy = sinon.spy();

    // creating mock store
    const mockStore = configureStore([])(stateInitial);

    // creating gameSettings
    const gameSettings = new GameSettings(stateInitial.gameSettings);

    // declaring wrapper, component
    let wrapper, component;

    beforeEach(()=>{

        // wrapping Settings
        wrapper = shallow(<Settings store={mockStore} onClose={onCloseSpy} />);

        // getting component
        component = wrapper.dive();
    });

    it('renders the component', () => {

        // should contain one ConnectedSettings
        expect(wrapper.find(ConnectedSettings)).toHaveLength(1);

        // should contain one .settings-container
        expect(component.find('.settings-container').find(LanguageSelect)).toHaveLength(1);

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

    describe('close button', () => {

        it('close button should call parent method onClose (that will redirect back back to the game)', () => {

            // firing click on .button-close
            component.find('.button-close').simulate('click');

            // should invoke onClose
            expect(onCloseSpy.calledOnce).toBeTruthy();
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

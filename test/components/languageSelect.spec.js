// test/components/languageSelect.spec.js
import React, {Component} from "react";
import configureStore from 'redux-mock-store'
import sinon from 'sinon';
import { shallow } from '../enzyme';
import LanguageSelect, { ConnectedLanguageSelect } from "../../src/js/components/settings/components/language-select/LanguageSelect";
import stateInitial from '../../src/js/constants/state';
import L from "../../src/js/localization/Localization";


describe('Component: LanguageSelect, ConnectedLanguageSelect',()=>{

    // setting spy on handleLanguageChanged
    const handleLanguageChangedSpy = sinon.spy(ConnectedLanguageSelect.prototype, "handleLanguageChanged");

    // creating mock store
    const mockStore = configureStore([])(stateInitial);

    // declaring wrapper, component
    let wrapper, component;

    beforeEach(()=>{

        // wrapping LanguageSelect
        wrapper = shallow(<LanguageSelect store={mockStore} />);

        // getting component
        component = wrapper.dive();
    });

    it('renders the component', () => {

        // should contain one ConnectedLanguageSelect
        expect(wrapper.find(ConnectedLanguageSelect)).toHaveLength(1);

        // should contain one div
        expect(component.find('div')).toHaveLength(1);

        // should contain one select
        expect(component.find('select')).toHaveLength(1);

        // should contain as much options as we have languages in L
        expect(component.find('option')).toHaveLength(L.getAvailableLanguages().length);
    });

    it('should have valid props', () => {

        // should have language prop, equal to stateInitial
        expect(wrapper.prop('language')).toEqual(stateInitial.globalSettings.language);

        // should be similar selected option to props.language
        expect(component.find('select').props().defaultValue).toEqual(wrapper.prop('language'));

        // should have globalChangeLanguage prop
        expect(wrapper.prop('globalChangeLanguage')).toBeDefined();

        // should be a function
        expect(typeof wrapper.prop('globalChangeLanguage')).toBe('function');
    });

    it('should call handleLanguageChanged prop with correct value', () => {

        // creating mock event
        const event = {
            target: { value: 'the-value' }
        };

        // firing event on select
        component.find('select').simulate('change', event);

        // handleLanguageChangedSpy should be called once
        expect(handleLanguageChangedSpy.calledOnce).toBeTruthy();

        // with parameter equal to mock event
        expect(handleLanguageChangedSpy.calledWith(event)).toBeTruthy();
    });
});
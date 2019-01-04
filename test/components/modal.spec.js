// test/components/appRouter.spec.js
import React from "react";
import {HashRouter, MemoryRouter, Route, browserHistory, Redirect} from "react-router-dom";
import { shallow, mount } from "enzyme/build";
import Modal from "../../src/js/components/modal/Modal";
import Records  from "../../src/js/components/records/Records";
import Settings  from "../../src/js/components/settings/Settings";
import {Provider} from "react-redux";
import store from "../../src/js/store";
import configureStore from "redux-mock-store";
import stateInitial from "../../src/js/constants/state";

import { createMemoryHistory } from 'history'

describe('Modal', () => {

    let wrapper;

    beforeEach(() => {

        // wrapping Modal
        wrapper = shallow(<Modal/>);
    });

    it('renders correct component', () => {

        // should contain .modal-wrapper and .modal-content and .settings-panel-close
        expect(wrapper.find('.modal-wrapper').find('.modal-content').find('.settings-panel-close')).toHaveLength(1);

        // should contain 2 routes
        expect(wrapper.find(Route)).toHaveLength(2);
    });

    it('renders correct routes', () => {

        // mapping routes
        wrapper.find(Route).map(route => {

            // getting props
            const routeProps = route.props();

            if (routeProps.path === '/modal/records/') {

                // '/modal/records/' should be related to Records
                expect(routeProps.render().type).toBe(Records);
            }
            if (routeProps.path === '/modal/settings/') {

                // '/modal/settings' should be related to Settings
                expect(routeProps.render().type).toBe(Settings);
            }
        });
    });

    describe('_goToHomePage ', () => {

        // mockPathname, mockHomePath, history
        let mockPathname, mockHomePath, history;

        beforeEach(() => {

            // mockPathname
            mockPathname = `/modal`;

            // mockHomePath
            mockHomePath = `/`;

            // creating history
            history = createMemoryHistory(mockHomePath);

            // wrapping Modal
            wrapper = shallow(<Modal history={history} location={{pathname: mockPathname}}/>);
        });

        it('close button should redirect back back to the game', () => {

            wrapper.find('.settings-panel-close').simulate('click');

            expect(history.entries[1].pathname).toBe(mockHomePath);

            expect(history.entries[1].state.from).toBe(mockPathname);
        });

        it('click outside should redirect back back to the home', () => {

            // mock clickHandler match
            let returnTrue = false;

            // creating mock event. as for now this event is for inside mouse down, so redirect should happen
            const event = { nativeEvent: { target: { classList: {contains: () => returnTrue}}}};

            // firing event on .modal-wrapper
            wrapper.find('.modal-wrapper').props().onMouseDown(event);

            // should not invoke history change
            expect(history.entries).toHaveLength(1);

            // changing event to meet redirect requirements
            returnTrue = true;

            // again firing event on .modal-wrapper
            wrapper.find('.modal-wrapper').props().onMouseDown(event);

            // should invoke history change
            expect(history.entries).toHaveLength(2);
        });
    });
});

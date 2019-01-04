// test/components/settings.spec.js
import React from "react";
import configureStore from 'redux-mock-store'
import sinon from 'sinon';
import { shallow } from '../_setup/enzyme';
import Records, { ConnectedRecords } from "../../src/js/components/records/Records";
import stateInitial from '../../src/js/constants/state';
import GameRecords  from "../../src/js/models/GameRecords";


describe('Component: Records, ConnectedRecords',()=>{

    // setting spy on _dispatchResetGameRecords
    const _dispatchResetGameRecordsSpy = sinon.spy(ConnectedRecords.prototype, "_dispatchResetGameRecords");
    const onCloseSpy = sinon.spy();

    // creating mock store
    let mockStore = configureStore([])(stateInitial);

    // creating gameRecords
    const gameRecords = new GameRecords();

    // declaring wrapper, component
    let wrapper, component;

    beforeEach(()=>{

        // wrapping Settings
        wrapper = shallow(<Records store={mockStore} onClose={onCloseSpy} />);

        // getting component
        component = wrapper.dive();
    });

    it('renders the component', () => {

        // should contain one ConnectedRecords
        expect(wrapper.find(ConnectedRecords)).toHaveLength(1);

        // should contain one div.records-container
        expect(component.find('.records-container')).toHaveLength(1);

        // should contain one .records-flex with 3 .records-column
        expect(component.find('.records-flex').find('.records-column')).toHaveLength(3);

        // should contain one .records-flex with 3 .records-column
        expect(component.find('.records-flex').find('div.records-column:first-child').find('span')).toHaveLength(gameRecords.simplified.length);

        // should contain one .buttons-group and two buttons inside it
        expect(component.find('.buttons-group').find('button')).toHaveLength(2);
    });

    describe('close button', () => {

        it('close button should call parent method onClose (that will redirect back back to the game)', () => {

            // firing click on .button-close
            component.find('.button-close').simulate('click');

            // should invoke onClose
            expect(onCloseSpy.calledOnce).toBeTruthy();
        });
    });

    describe('green button button', () => {

        it('should invoke reset gameRecords with confirmation', () => {

            // firing click on .button-green
            component.find('.button-green').props().onClick();

            // _dispatchResetGameRecordsSpy should not be called
            expect(_dispatchResetGameRecordsSpy.calledOnce).toBeFalsy();

            // .isResetGameRecords should be true
            expect(component.state().isResetGameRecords).toBeTruthy();

            // firing click on .button-green one more time
            component.find('.button-green').props().onClick();

            // _dispatchResetGameRecordsSpy should be called once
            expect(_dispatchResetGameRecordsSpy.calledOnce).toBeTruthy();

            // .isResetGameRecords should be false
            expect(component.state().isResetGameRecords).toBeFalsy();
        });
    });

    describe('displaying records cases', () => {

        it('should contain .record-time if some record time is 1', () => {

            // mockTime
            const mockTime = 1;

            // setting one record to 0 to invoke <1 case
            gameRecords.addRecord(gameRecords.simplified[0]._props, mockTime);

            // creating mockStore
            mockStore = configureStore([])({...stateInitial, gameRecordsSimple: gameRecords.simplified});

            // wrapping Settings
            wrapper = shallow(<Records store={mockStore}/>);

            // getting component
            component = wrapper.dive();

            // should contain one div.record-time
            expect(component.find('.record-time')).toHaveLength(1);
        });

        it('should contain .record-zero if some record time is 0', () => {

            // mockTime
            const mockTime = 0;

            // setting one record to 0 to invoke <1 case
            gameRecords.addRecord(gameRecords.simplified[0]._props, mockTime);

            // creating mockStore
            mockStore = configureStore([])({...stateInitial, gameRecordsSimple: gameRecords.simplified});

            // wrapping Settings
            wrapper = shallow(<Records store={mockStore}/>);

            // getting component
            component = wrapper.dive();

            // should contain one div.record-zero
            expect(component.find('.record-zero')).toHaveLength(1);
        });
    });
});

// test/components/game.spec.js
import sinon from "sinon";
import {shallow} from "enzyme/build";
import React from "react";
import {Link} from "react-router-dom";
import store from "../../src/js/store/index";
import L from "../../src/js/localization/Localization";
import Game, { ConnectedGame } from "../../src/js/components/game/Game";
import Field from "../../src/js/components/game/components/field/Field";
import GameRecords from "../../src/js/models/GameRecords";
import { processFieldAction } from "../../src/js/actions";

jest.useFakeTimers();

describe('Component: Game, ConnectedGame',()=> {

    // setting spy on _reduxGlobalChangeLanguage
    const _reduxGlobalChangeLanguageSpy = sinon.spy(ConnectedGame.prototype, "_reduxGlobalChangeLanguage");

    // setting spy on _reduxResetGame
    const _reduxResetGameSpy = sinon.spy(ConnectedGame.prototype, "_reduxResetGame");

    // creating mock store
    const mockStore = store;

    // declaring wrapper, component
    let wrapper, component;

    beforeEach(() => {

        // wrapping Game
        wrapper = shallow(<Game store={mockStore}/>);

        // getting component
        component = wrapper.dive();
    });

    it('renders the component', () => {

        // should contain one ConnectedGame
        expect(wrapper.find(ConnectedGame)).toHaveLength(1);

        // should contain one .main-wrapper with .game inside
        expect(component.find('.main-wrapper').find('.game')).toHaveLength(1);

        // should contain one .control-panel
        expect(component.find('.control-panel')).toHaveLength(1);

        // should contain one .top-panel with 2 '.top-panel-link'
        expect(component.find('.top-panel').find('.top-panel-link')).toHaveLength(2);

        // should contain first .top-panel-link with a link to a /modal/settings
        expect(component.find('.top-panel-link:first-child').find(Link).props().to).toBe('/modal/settings/');

        // should contain last .top-panel-link with a link to a /modal/records
        expect(component.find('.top-panel-link:last-child').find(Link).props().to).toBe('/modal/records/');

        // should contain one .game-panel
        expect(component.find('.game-panel')).toHaveLength(1);

        // should contain one .mines-left
        expect(component.find('.mines-left')).toHaveLength(1);

        // should contain one .main-button-wrapper with one .main-button
        expect(component.find('.main-button-wrapper').find('.main-button')).toHaveLength(1);

        // should contain one .time-display
        expect(component.find('.time-display')).toHaveLength(1);

        // should contain one .field-wrapper with one Field inside
        expect(component.find('.field-wrapper').find(Field)).toHaveLength(1);
    });

    describe('componentWillMount', () => {

        it('should properly set language if it exist in localStorage', () => {

            // looping languages
            L.getAvailableLanguages().map(language => {

                // setting language to the localStorage
                localStorage.setItem('language', language);

                // updating component
                wrapper.dive();

                // _reduxGlobalChangeLanguageSpy should be called with language
                expect(_reduxGlobalChangeLanguageSpy.calledWith(language)).toBeTruthy();
            });

            // removing language from the localStorage
            localStorage.removeItem('language');
        });
    });

    describe('handleGameMouseDown, handleGameMouseUp', () => {

        it('should properly set isMouseDown in state', () => {

            // getting .field-wrapper
            const fieldWrapper = component.find('.field-wrapper');

            // .isMouseDown should be false
            expect(component.state().isMouseDown).toBeFalsy();

            // firing mousedown
            fieldWrapper.simulate('mousedown');

            // .isMouseDown should be true
            expect(component.state().isMouseDown).toBeTruthy();

            // firing mouseup
            fieldWrapper.simulate('mouseup');

            // .isMouseDown should be false
            expect(component.state().isMouseDown).toBeFalsy();
        });
    });

    describe('timer', () => {

        it('should properly increase time', async () => {

            // creating action
            const action = {
                tileIndex: 0,
                isPrimaryAction: true,
            };

            // dispatching action
            store.dispatch(processFieldAction(action));

            // updating component
            wrapper.update();
            component = wrapper.dive();
            component.instance().componentDidUpdate();

            // timer property should be greater than 1
            expect(component.state().timer).toBeGreaterThanOrEqual(1);

            // running timers
            jest.runOnlyPendingTimers();

            // .game.time should be 1
            expect(wrapper.props().game.time).toBe(1);
        });
    });

    describe('scenario game lose and reset', () => {

        it('should properly begin and reset game', async () => {

            // creating action
            const action = {
                tileIndex: 0,
                isPrimaryAction: true,
            };

            // dispatching primary action
            store.dispatch(processFieldAction(action));

            // getting index of tile with a bomb
            const tileBombIndex = store.getState().game.tiles.findIndex(tile => tile.isBomb);

            // dispatching primary action on bomb tile
            store.dispatch(processFieldAction({...action, tileIndex: tileBombIndex}));

            // updating component
            wrapper.update();
            component = wrapper.dive();

            // setting timer
            component.setState({timer: 2});

            // performing componentDidUpdate
            component.instance().componentDidUpdate();

            // .timer should be null
            expect(component.state().timer).toBeNull();

            // simulating click on reset game
            component.find('.main-button').simulate('click');

            // _reduxResetGameSpy should be called once
            expect(_reduxResetGameSpy.calledOnce).toBeTruthy();
        });
    });

    describe('scenario game won', () => {

        it('should properly finish game', async () => {

            // creating action
            const action = {
                tileIndex: 0,
                isPrimaryAction: true,
            };

            // dispatching primary action
            store.dispatch(processFieldAction(action));

            // getting index of tile with a bomb
            store.getState().game.tiles.map((tile, i) => tile.isNumber);

            let tileIndex;
            while (~tileIndex) {

                // getting tileIndex of non opened and non bomb tile
                tileIndex = store.getState().game.tiles.findIndex(tile => !tile.isOpened && !tile.isBomb);

                // dispatching primary action on bomb tile
                store.dispatch(processFieldAction({...action, tileIndex: tileIndex}));
            }

            // updating component
            wrapper.update();
            component = wrapper.dive();

            // getting .field-wrapper
            const fieldWrapper = component.find('.field-wrapper');

            // firing mousedown
            fieldWrapper.simulate('mousedown');

            // .isMouseDown should be true
            expect(component.state().isMouseDown).toBeFalsy();

            // firing mouseup
            fieldWrapper.simulate('mouseup');

            // .isMouseDown should be false
            expect(component.state().isMouseDown).toBeFalsy();

            // getting gameRecords
            const gameRecords = new GameRecords(component.state().gameRecordsSimple);

            // record.isRecord should be true
            expect(gameRecords.simplified[0].isRecord).toBeTruthy();
        });
    });
});

// test/components/field.spec.js
import sinon from "sinon";
import {shallow} from "enzyme/build";
import Field, { ConnectedField, MOUSE_DOWN_WHICH_TYPE } from "../../src/js/components/game/components/field/Field";
import React from "react";
import GameSettings from "../../src/js/models/GameSettings";
import store from "../../src/js/store/index";


describe('Component: Field, ConnectedField',()=> {

    // creating mock store
    const mockStore = store;

    // declaring wrapper, component
    let wrapper, component, gameSettings, tile;

    beforeEach(() => {

        // wrapping Field
        wrapper = shallow(<Field store={mockStore}/>);

        // getting component
        component = wrapper.dive();

        // creating mock store
        gameSettings = new GameSettings(component.props().gameSettings);

        // getting first tile
        tile = component.find('.tile').first();
    });

    it('renders the component', () => {

        // should contain one ConnectedLanguageSelect
        expect(wrapper.find(ConnectedField)).toHaveLength(1);

        // tiles count should be equal to the settings .tilesCount
        expect(component.find('.tile')).toHaveLength(gameSettings.tilesCount);
    });

    describe('handleContextMenu', () => {

        it('contextmenu should be prevented', () => {

            // creating mock event
            const event = {
                preventDefault: sinon.spy()
            };

            // firing event
            component.find('.tile').first().props().onContextMenu(event);

            // event.preventDefault should be called once
            expect(event.preventDefault.calledOnce).toBeTruthy();
        })
    });

    describe('onMouseDown', () => {

        it('contextmenu should be prevented', () => {

            // creating mock event
            const event = {
                nativeEvent: {
                    which: MOUSE_DOWN_WHICH_TYPE.RIGHT_CLICK,
                }
            };

            // firing event
            tile.props().onMouseDown(event);

            // state.which should be MOUSE_DOWN_WHICH_TYPE.RIGHT_CLICK
            expect(component.state().which).toBe(MOUSE_DOWN_WHICH_TYPE.RIGHT_CLICK);

            // .isMouseDown should be false
            expect(component.state().isMouseDown).toBeFalsy();

            // changing mock event
            event.nativeEvent.which = MOUSE_DOWN_WHICH_TYPE.LEFT_CLICK;

            // firing event
            tile.props().onMouseDown(event);

            // state.which should be MOUSE_DOWN_WHICH_TYPE.LEFT_CLICK
            expect(component.state().which).toBe(MOUSE_DOWN_WHICH_TYPE.LEFT_CLICK);

            // .isMouseDown should be true
            expect(component.state().isMouseDown).toBeTruthy();
        });
    });

    describe('onMouseUp', () => {

        it('should place flag and question', () => {

            // ensuring that we can use question
            gameSettings._constants.isQuestionTileEnabled = true;

            // firing event
            tile.simulate('mouseup');

            // state.which should be undefined
            expect(component.state().which).toBeUndefined();

            // .isMouseDown should be false
            expect(component.state().isMouseDown).toBeFalsy();

            // updating wrapper, component getting first tile
            wrapper.update();
            component = wrapper.dive();
            tile = component.find('.tile').first();

            // to now should have a flag class
            expect(tile.hasClass('tile-flag')).toBeTruthy();

            // firing event again
            tile.simulate('mouseup');

            // updating wrapper, component getting first tile
            wrapper.update();
            component = wrapper.dive();
            tile = component.find('.tile').first();

            // to now should have a question class
            expect(tile.hasClass('tile-question')).toBeTruthy();

            // firing event again
            tile.simulate('mouseup');

            // updating wrapper, component getting first tile
            wrapper.update();
            component = wrapper.dive();
            tile = component.find('.tile').first();

            // to not should have a flag class
            expect(tile.hasClass('tile-flag')).toBeFalsy();

            // to not should have a question class
            expect(tile.hasClass('tile-question')).toBeFalsy();
        });

        it('should display numbers, wrong-flag, bombs on lost game', () => {

            // ensuring that we can use question
            gameSettings._constants.isQuestionTileEnabled = true;

            // creating mock event
            const event = {
                nativeEvent: {
                    which: MOUSE_DOWN_WHICH_TYPE.LEFT_CLICK,
                }
            };

            // firing event
            tile.props().onMouseDown(event);

            // firing mouseup event
            tile.simulate('mouseup');

            // updating wrapper, component getting first tile
            wrapper.update();
            component = wrapper.dive();

            // getting index of tile with number
            const numberTileIndex = wrapper.props().game.tiles.findIndex(tile => tile.number);

            // getting tile with number
            tile = component.find('.tile').get(numberTileIndex);

            // firing event
            tile.props.onMouseDown(event);

            // firing mouseup event
            tile.props.onMouseUp();

            // updating wrapper, component getting first tile
            wrapper.update();
            component = wrapper.dive();
            tile = component.find('.tile').get(numberTileIndex);

            // tile with number should be opened
            expect(~tile.props.className.indexOf('tile-opened')).toBeTruthy();

            // setting event to right click
            event.nativeEvent.which = MOUSE_DOWN_WHICH_TYPE.RIGHT_CLICK;

            // getting index of tile with empty
            const emptyTileIndex = wrapper.props().game.tiles.findIndex(tile => !tile.isBomb && !tile.isOpened);

            // getting tile with empty
            tile = component.find('.tile').get(emptyTileIndex);

            // firing event
            tile.props.onMouseDown(event);

            // firing mouseup event
            tile.props.onMouseUp();

            // updating wrapper, component getting first tile
            wrapper.update();
            component = wrapper.dive();

            // getting index of tile with bomb and placing right flag
            const bombTileIndexForFlag = wrapper.props().game.tiles.findIndex(tile => tile.isBomb);

            // getting tile with bomb
            tile = component.find('.tile').get(bombTileIndexForFlag);

            // firing event
            tile.props.onMouseDown(event);

            // firing mouseup event
            tile.props.onMouseUp();

            // updating wrapper, component getting first tile
            wrapper.update();
            component = wrapper.dive();

            // getting index of tile with bomb and placing question
            const bombTileIndexForQuestion = wrapper.props().game.tiles.findIndex(tile => !tile.isBomb && !tile.isFlag && !tile.isOpened && !tile.isQuestion);

            // getting tile with bomb
            tile = component.find('.tile').get(bombTileIndexForQuestion);

            // firing event
            tile.props.onMouseDown(event);

            // firing mouseup event
            tile.props.onMouseUp();

            // firing event
            tile.props.onMouseDown(event);

            // firing mouseup event
            tile.props.onMouseUp();

            // updating wrapper, component getting first tile
            wrapper.update();
            component = wrapper.dive();

            // setting event back to left click for future actions
            event.nativeEvent.which = MOUSE_DOWN_WHICH_TYPE.LEFT_CLICK;

            // getting index of tile with bomb
            const bombTileIndex = wrapper.props().game.tiles.findIndex(tile => tile.isBomb && !tile.isFlag && !tile.isQuestion);

            // getting tile with bomb
            tile = component.find('.tile').get(bombTileIndex);

            // firing event
            tile.props.onMouseDown(event);

            // firing mouseup event
            tile.props.onMouseUp();

            // updating wrapper, component getting first tile
            wrapper.update();
            component = wrapper.dive();
            tile = component.find('.tile').get(bombTileIndex);

            // tile with bomb should be opened
            expect(~tile.props.className.indexOf('tile-bomb')).toBeTruthy();

            // getting tile with empty
            tile = component.find('.tile').get(emptyTileIndex);

            // empty tile with flag should have wrong flag class
            expect(~tile.props.className.indexOf('tile-flag-wrong')).toBeTruthy();

            // game should be finished
            expect(wrapper.props().game.finished).toBeTruthy();
        });
    });
});
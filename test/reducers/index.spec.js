import { createStore } from "redux";
import { rootReducer } from '../../src/js/reducers';
import store from "../../src/js/store/index";
import { globalChangeLanguage, resetGame, updateGameTime, changeGameSettings, processFieldAction } from "../../src/js/actions/index";
import L from "../../src/js/localization/Localization";
import GameSettings from "../../src/js/models/GameSettings";
import stateInitial from '../../src/js/constants/state';
import gameInitial from '../../src/js/constants/game';


describe('rootReducer', () => {

    it('should return the initial state', () => {

        // stateInitial exist
        expect(stateInitial).toBeDefined();

        // .globalSettings exist
        expect(stateInitial.globalSettings).toBeDefined();

        // .globalSettings.language exist
        expect(stateInitial.globalSettings.language).toBeDefined();

        // .gameSettings exist
        expect(stateInitial.gameSettings).toBeDefined();

        // .gameSettings instanceof GameSettings
        expect(stateInitial.gameSettings).toEqual(new GameSettings().props);

        // .game exist
        expect(stateInitial.game).toBeDefined();

        // .game is equal to gameInitial
        expect(stateInitial.game).toEqual(gameInitial);

        // .tiles exist
        expect(gameInitial.tiles).toBeDefined();

        // .tiles.length is 0
        expect(gameInitial.tiles.length).toBe(0);

        // .time exist
        expect(gameInitial.time).toBeDefined();

        // .time is 0
        expect(gameInitial.time).toBe(0);

        // .flags exist
        expect(gameInitial.flags).toBeDefined();

        // .flags is 0
        expect(gameInitial.flags).toBe(0);

        // .started exist
        expect(gameInitial.started).toBeDefined();

        // .started is false
        expect(gameInitial.started).toBe(false);

        // .finished exist
        expect(gameInitial.finished).toBeDefined();

        // .finished is false
        expect(gameInitial.finished).toBe(false);

        // .won exist
        expect(gameInitial.won).toBeDefined();

        // .won is false
        expect(gameInitial.won).toBe(false);

        // should be equal to initial state
        expect(rootReducer(undefined, {})).toEqual(stateInitial);
    });

    it('should return the state with changed .language on LANGUAGE_CHANGED', () => {

        // invalid value
        const invalidLanguage = 'invalidLanguage';

        // getting initial language
        const languageInitial = rootReducer(undefined, {}).globalSettings.language;

        // creating action to change language with invalid value
        const action = globalChangeLanguage(invalidLanguage);

        // state language to be equal to current language
        expect(rootReducer(undefined, action).globalSettings.language).toEqual(languageInitial);

        // looping available languages
        L.getAvailableLanguages().map(languageCode => {

            // creating action to change language
            const action = globalChangeLanguage(languageCode);

            // state language to be equal to current language
            expect(rootReducer(undefined, action).globalSettings.language).toEqual(languageCode);
        });
    });

    it('should return the state with cleaned .game on MINESWEEPER.RESET_GAME', () => {

        // creating action for reset game
        const action = resetGame();

        // should be equal to initial state
        expect(rootReducer(undefined, action)).toEqual(stateInitial);
    });

    it('should return the state with updated .time on MINESWEEPER.UPDATE_GAME_TIME', () => {

        // const time
        const time = 10;

        // creating action for reset game
        const action = updateGameTime(time);

        // time in state should be equal to time
        expect(rootReducer(undefined, action).game.time).toEqual(time);
    });

    it('should return the state with updated .gameSettings on MINESWEEPER.CHANGE_GAME_SETTINGS', () => {

        // creating GameSettings to get a presets
        let gameSettings = new GameSettings();

        // getting game settings from most likely different preset
        gameSettings = new GameSettings(gameSettings.presets.reverse().find(preset => preset.props).props);

        // creating action for change game settings
        const action = changeGameSettings(gameSettings);

        // gameSettings in state should be equal to gameSettings
        expect(rootReducer(undefined, action).gameSettings).toEqual(gameSettings);

        // game in state should be equal to gameInitial
        expect(rootReducer(undefined, action).game).toEqual(gameInitial);
    });

    it('should return the state updated due the MINESWEEPER.PROCESS_USER_FIELD_ACTION: primary action, start game, create tiles, flag, question', () => {

        const tileIndex = 0;

        // creating a primary action
        const actionPrimary = processFieldAction({tileIndex: tileIndex, isPrimaryAction: true});

        // creating a not primary action
        const actionSecondary = processFieldAction({tileIndex: tileIndex, isPrimaryAction: false});

        // generating state after actionSecondary
        let state = rootReducer(undefined, actionSecondary);

        let flags = state.game.flags;

        // .game.started in state should be true
        expect(state.game.started).toBeTruthy();

        // .game.tiles should be not empty
        expect(!!state.game.tiles.length).toBeTruthy();

        // tile should be a flag
        expect(state.game.tiles[tileIndex].isFlag).toBeTruthy();

        // .game.tiles should have no bombs placed
        expect(state.game.tiles.filter(_ => _.isBomb).length).toBe(0);

        // creating GameSettings to get a presets
        let gameSettings = new GameSettings(state.gameSettings);

        // generating state after primary action
        state = rootReducer(state, actionPrimary);

        // tile should still be flag
        expect(state.game.tiles[tileIndex].isFlag).toBeTruthy();

        // tile should not be opened
        expect(state.game.tiles[tileIndex].isOpened).toBeFalsy();

        // disabling question mode
        gameSettings._constants.isQuestionTileEnabled = false;

        // generating state after duplicating user action
        state = rootReducer(state, actionSecondary);

        // tile should not be flag
        expect(state.game.tiles[tileIndex].isFlag).toBeFalsy();

        // tile should not be question
        expect(state.game.tiles[tileIndex].isQestion).toBeFalsy();

        // flags should be increased
        expect(state.game.flags).toBe(flags - 1);

        // enabling question mode
        gameSettings._constants.isQuestionTileEnabled = true;

        // generating state after user action, changing to flag
        state = rootReducer(state, actionSecondary);

        // generating state after user action, changing flag to question
        state = rootReducer(state, actionSecondary);

        // tile should not be flag
        expect(state.game.tiles[tileIndex].isFlag).toBeFalsy();

        // tile should be question
        expect(state.game.tiles[tileIndex].isQestion).toBeTruthy();

        // flags should be increased
        expect(state.game.flags).toBe(flags - 1);

        // generating state after primary action
        state = rootReducer(state, actionPrimary);

        // tile should not be flag
        expect(state.game.tiles[tileIndex].isFlag).toBeFalsy();

        // tile should be question
        expect(state.game.tiles[tileIndex].isQestion).toBeTruthy();

        // tile should not be opened
        expect(state.game.tiles[tileIndex].isOpened).toBeFalsy();

        // generating state after duplicating user action
        state = rootReducer(state, actionSecondary);

        // tile should not be flag
        expect(state.game.tiles[tileIndex].isFlag).toBeFalsy();

        // tile should be question
        expect(state.game.tiles[tileIndex].isQestion).toBeFalsy();
    });

    it('should return the state updated due the MINESWEEPER.PROCESS_USER_FIELD_ACTION: primary action, start game, create tiles, seed bombs, open field', () => {

        const tileIndex = 0;

        // creating a primary action
        let actionPrimary = processFieldAction({tileIndex: tileIndex, isPrimaryAction: true});

        // creating a not primary action
        const actionSecondary = processFieldAction({tileIndex: tileIndex, isPrimaryAction: false});

        // generating state
        let state = rootReducer(rootReducer(undefined, resetGame()), actionPrimary);

        // .game.started in state should be true
        expect(state.game.started).toBeTruthy();

        // .game.tiles should be not empty
        expect(!!state.game.tiles.length).toBeTruthy();

        // creating GameSettings to get a presets
        let gameSettings = new GameSettings(state.gameSettings);

        // .game.tiles should be equal to settings
        expect(state.game.tiles.filter(_ => _.isBomb).length).toBe(gameSettings.bombs);

        // tile should be opened
        expect(state.game.tiles[tileIndex].isOpened).toBeTruthy();

        // tile should be not a bomb
        expect(state.game.tiles[tileIndex].isBomb).toBeFalsy();

        // trying to apply secondary action on tile
        state = rootReducer(state, actionSecondary);

        // tile should be opened
        expect(state.game.tiles[tileIndex].isOpened).toBeTruthy();

        // tile should be not a flag
        expect(state.game.tiles[tileIndex].isFlag).toBeFalsy();

        // getting empty tile
        const emptyTileIndex = state.game.tiles.findIndex(_ => !_.isBomb && !_.isOpened && !_.number);

        // creating a primary action
        actionPrimary = processFieldAction({tileIndex: emptyTileIndex, isPrimaryAction: true});

        // generating state
        state = rootReducer(state, actionPrimary);

        // tile should be opened
        expect(state.game.tiles[emptyTileIndex].isOpened).toBeTruthy();

        // looping neighbors, each
        state.game.tiles[emptyTileIndex].neighbors.map(_ => {

            // tile should be opened
            expect(_.isOpened).toBeTruthy();
        })
    });

    it('should return the state updated due the MINESWEEPER.PROCESS_USER_FIELD_ACTION: bomb, finish game, block field', () => {

        const tileIndex = 0;

        // creating primary action
        const actionPrimary = processFieldAction({tileIndex: tileIndex, isPrimaryAction: true});

        // generating state
        let state = rootReducer(rootReducer(undefined, resetGame()), actionPrimary);

        // finding a bomb
        const bombTileIndex = state.game.tiles.reverse().findIndex(_ => _.isBomb);

        // creating action for a primary action
        const actionPrimaryOnBomb = processFieldAction({tileIndex: bombTileIndex, isPrimaryAction: true});

        // trying to apply secondary action on tile
        state = rootReducer(state, actionPrimaryOnBomb);

        // .game.tiles should be equal to settings
        expect(state.game.tiles[bombTileIndex].isOpened).toBeTruthy();

        // .game.finished should be true
        expect(state.game.finished).toBeTruthy();

        // .game.won should be false
        expect(state.game.won).toBeFalsy();

        // getting index of a still closed tile
        const closedTile = state.game.tiles.findIndex(_ => !_.isOpened);

        // creating a not primary action
        const actionSecondary = processFieldAction({tileIndex: closedTile, isPrimaryAction: false});

        // trying to apply secondary action on another tile
        state = rootReducer(state, actionSecondary);

        // creating another primary action
        const actionPrimary2 = processFieldAction({tileIndex: closedTile, isPrimaryAction: true});

        // trying to apply secondary action on another tile
        state = rootReducer(state, actionPrimary2);

        // another tile should not respond on any action
        expect(state.game.tiles[closedTile].isOpened).toBeFalsy();
    });

    it('should return the state updated due the MINESWEEPER.PROCESS_USER_FIELD_ACTION: open, won', () => {

        const tileIndex = 0;

        // creating primary action
        const actionPrimary = processFieldAction({tileIndex: tileIndex, isPrimaryAction: true});

        // generating state
        let state = rootReducer(rootReducer(undefined, resetGame()), actionPrimary);

        state.game.tiles.map((tile, i) => {
            if (!tile.isBomb && !tile.isOpened) {

                // creating primary action
                const actionPrimary = processFieldAction({tileIndex: i, isPrimaryAction: true});

                state = rootReducer(state, actionPrimary);
            }
        });

        // .game.finished should be true
        expect(state.game.finished).toBeTruthy();

        // .game.won should be true
        expect(state.game.won).toBeTruthy();
    });
});
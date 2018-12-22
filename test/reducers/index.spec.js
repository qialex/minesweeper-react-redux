import { globalChangeLanguage, resetGame, updateGameTime, changeGameSettings, processFieldAction } from "../../src/js/actions/index";
import { rootReducer } from '../../src/js/reducers';
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

        // looping available languages
        L.getAvailableLanguages().map(languageCode => {

            // creating action to change language
            const action = globalChangeLanguage(languageCode);

            // state language to be equal to current language
            expect(rootReducer(undefined, action).globalSettings.language).toEqual(languageCode);
        })
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
});
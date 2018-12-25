import { MINESWEEPER, LANGUAGE_CHANGED } from '../../src/js/constants/action-types';
import {
    globalChangeLanguage,
    resetGame,
    changeGameSettings,
    updateGameTime,
    processFieldAction,
} from '../../src/js/actions/index';
import GameSettings from '../../src/js/models/GameSettings';


describe('actions', () => {

    it('should create an action to change language', () => {

        const language = 'en';

        const expectedAction = {
            type: LANGUAGE_CHANGED,
            payload: language,
        };

        expect(globalChangeLanguage(language)).toEqual(expectedAction)
    });

    it('should create an action to reset game', () => {

        const expectedAction = {
            type: MINESWEEPER.RESET_GAME,
        };

        expect(resetGame()).toEqual(expectedAction)
    });

    it('should create an action to change game settings game', () => {

        const gameSettings = new GameSettings().props;

        const expectedAction = {
            type: MINESWEEPER.CHANGE_GAME_SETTINGS,
            payload: gameSettings,
        };

        expect(changeGameSettings(gameSettings)).toEqual(expectedAction)
    });

    it('should create an action to update time', () => {

        const time = 10;

        const expectedAction = {
            type: MINESWEEPER.UPDATE_GAME_TIME,
            payload: time,
        };

        expect(updateGameTime(time)).toEqual(expectedAction)
    });

    it('should create an action to process a click (tap) on field', () => {

        let obj = {tileIndex: 5, isPrimaryAction: true};

        let expectedAction = {
            type: MINESWEEPER.PROCESS_USER_FIELD_ACTION,
            payload: obj,
        };

        expect(processFieldAction(obj)).toEqual(expectedAction);

        obj = {tileIndex: 5, isPrimaryAction: false};

        expectedAction = {
            type: MINESWEEPER.PROCESS_USER_FIELD_ACTION,
            payload: obj,
        };

        expect(processFieldAction(obj)).toEqual(expectedAction);
    });
});
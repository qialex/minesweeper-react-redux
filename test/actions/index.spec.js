import { MINESWEEPER, LANGUAGE_CHANGED } from '../../src/js/constants/action-types';
import {
    globalChangeLanguage,
    resetGame,
    changeGameSettings,
    updateGameTime,
    processFieldAction,
    resetGameRecords,
} from '../../src/js/actions/index';
import GameSettings from '../../src/js/models/GameSettings';


describe('actions', () => {

    it('should create an action to change language', () => {

        // mockLanguage
        const mockLanguage = 'en';

        // expected action
        const expectedAction = {
            type: LANGUAGE_CHANGED,
            payload: mockLanguage,
        };

        // should be equal to the result of globalChangeLanguage
        expect(globalChangeLanguage(mockLanguage)).toEqual(expectedAction)
    });

    it('should create an action to reset game', () => {

        // expected action
        const expectedAction = {
            type: MINESWEEPER.RESET_GAME,
        };

        // should be equal to the result of resetGame
        expect(resetGame()).toEqual(expectedAction)
    });

    it('should create an action to change game settings game', () => {

        // mockGameSettings
        const mockGameSettings = new GameSettings().props;

        // expected action
        const expectedAction = {
            type: MINESWEEPER.CHANGE_GAME_SETTINGS,
            payload: mockGameSettings,
        };

        // should be equal to the result of changeGameSettings
        expect(changeGameSettings(mockGameSettings)).toEqual(expectedAction)
    });

    it('should create an action to update time', () => {

        // mockTime
        const mockTime = 10;

        // expected action
        const expectedAction = {
            type: MINESWEEPER.UPDATE_GAME_TIME,
            payload: mockTime,
        };

        // should be equal to the result of updateGameTime
        expect(updateGameTime(mockTime)).toEqual(expectedAction)
    });

    it('should create an action to process a click (tap) on field', () => {

        // mockPayload
        let mockPayload = {tileIndex: 5, isPrimaryAction: true};

        // expected action
        let expectedAction = {
            type: MINESWEEPER.PROCESS_USER_FIELD_ACTION,
            payload: mockPayload,
        };

        // should be equal to the result of processFieldAction
        expect(processFieldAction(mockPayload)).toEqual(expectedAction);

        // udating mock payload
        mockPayload = {tileIndex: 5, isPrimaryAction: false};

        // expected action
        expectedAction = {
            type: MINESWEEPER.PROCESS_USER_FIELD_ACTION,
            payload: mockPayload,
        };

        // should be equal to the result of processFieldAction
        expect(processFieldAction(mockPayload)).toEqual(expectedAction);
    });

    it('should create an action to reset gare records', () => {

        // expected action
        const expectedAction = {
            type: MINESWEEPER.RESET_GAME_RECORDS,
        };

        // should be equal to the result of resetGameRecords
        expect(resetGameRecords()).toEqual(expectedAction)
    });
});

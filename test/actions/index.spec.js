import { MINESWEEPER, LANGUAGE_CHANGED } from "../../src/js/constants/action-types";
import {
    globalChangeLanguage,
    resetGame,
    changeGameSettings,
    updateGameTime,
    processLeftClick,
    processRightClick
} from "../../src/js/actions/index";
import GameSettings from "../../src/js/models/GameSettings";


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

    it('should create an action to process a left click', () => {

        const corrdinaes = {x: 1, y: 5};

        const expectedAction = {
            type: MINESWEEPER.PROCESS_LEFT_CLICK,
            payload: corrdinaes,
        };

        expect(processLeftClick(corrdinaes)).toEqual(expectedAction)
    });

    it('should create an action to process a right click', () => {

        const corrdinaes = {x: 1, y: 5};

        const expectedAction = {
            type: MINESWEEPER.PROCESS_RIGHT_CLICK,
            payload: corrdinaes,
        };

        expect(processRightClick(corrdinaes)).toEqual(expectedAction)
    });

});
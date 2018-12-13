// src/js/reducers/index.js
import { MINESWEEPER } from "../constants/action-types";
import { LANGUAGE_CHANGED } from "../constants/action-types";
import L from "../localization/Localization";
import GameSettings from "../models/GameSettings";
import {seedBombs, createFields, checkIfGameWon, getFieldByCoordinates, openField} from '../utils/utils';


export const initialState = {
    globalSettings: {
        language: L.getLanguage(),
    },
    gameSettings: new GameSettings().getData(),
    game: {
        fields: undefined,
        time: 0,
        flags: 0,
        started: false,
        finished: false,
        won: false,
    },
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case LANGUAGE_CHANGED: {

            const language = action.payload;

            if (~L.getAvailableLanguages().indexOf(language)) {
                // setting language
                L.setLanguage(language);

                // saving selected language to the local storage
                localStorage.setItem('language', language);

                // updating state
                return { ...state, globalSettings: {...state.globalSettings, language: language} };
            }

            return state;
        }
        case MINESWEEPER.RESET_GAME: {
            let { game } = state;

            // if game not started
            if (!game.started) {
                return state;
            }

            // starting new game
            const newGame = {
                fields: undefined,
                time: 0,
                flags: 0,
                started: false,
                finished: false,
                won: false,
            };

            return { ...state, game: newGame };
        }
        case MINESWEEPER.UPDATE_GAME_TIME: {

            // updating game time
            return { ...state, game: {...state.game, time: action.payload } };
        }
        case MINESWEEPER.CHANGE_GAME_SETTINGS: {

            // resetting game when settings are selected
            const game = {
                fields: undefined,
                time: 0,
                flags: 0,
                started: false,
                finished: false,
                won: false,
            };

            return { ...state, game: game, gameSettings: action.payload };
        }
        case MINESWEEPER.PROCESS_LEFT_CLICK: {

            const { game } = state;
            const { gameSettings } = state;
            const { x, y } = action.payload;

            if (!game.started) {

                // if game not started yet - generate field
                game.fields = createFields(gameSettings);
                game.fields = seedBombs(game.fields, gameSettings, {x, y});
                game.started = true;
                game.finished = false;
                game.won = false;
            }


            if (game.started && game.fields && game.fields.length && !game.fields.find(_ => _.isBomb)) {

                // if game was started by right click - still need to generate mines
                game.fields = seedBombs(game.fields, gameSettings, {x, y});
            }

            // getting field
            const field = getFieldByCoordinates(game.fields, x, y);

            if (game.finished || field.isOpened || field.isFlag || field.isQestion) {

                // if game is finished - do nothing
                return state;
            }

            if (field.isBomb) {

                // if clicked on bomb - finish game
                game.finished = true;
                field.isOpened = true;
            } else {

                // open fields recursively
                openField(field);

                if (checkIfGameWon(game.fields)) {

                    game.fields.map(field => {

                        // placing flag on all fields
                        if (field.isBomb && !field.isFlag) {
                            field.isQuestion = false;
                            field.isFlag = true;
                        }
                    });

                    // if game is won
                    game.finished = true;
                    game.won = true;
                }
            }

            return { ...state, game: game };
        }
        case MINESWEEPER.PROCESS_RIGHT_CLICK: {

            const { game, gameSettings } = state;
            const { x, y } = action.payload;

            if (game.finished) {

                // if game is finished - do nothing
                return state;
            }

            if (!game.started) {

                // if game not started yet - generate field, but not place mines
                game.fields = createFields(gameSettings);
                game.started = true;
                game.finished = false;
                game.won = false;
            }

            // getting field
            const field = getFieldByCoordinates(game.fields, x, y);

            if (field.isOpened) {

                // if game is opened - do nothing
                return state;
            }


            if (field.isFlag) {

                // change flag to a question
                field.isQestion = true;
                field.isFlag = false;
                game.flags = game.flags - 1;

            } else if (field.isQestion) {

                // change question to nothing
                field.isQestion = false;
                field.isFlag = false;

            } else {

                // change nothing to a flag
                game.flags = game.flags + 1;
                field.isQestion = false;
                field.isFlag = true;
            }

            return { ...state, game: game };
        }
        default:
            return state;
    }
};
export default rootReducer;
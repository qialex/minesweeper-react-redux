// src/js/reducers/index.js
import { MINESWEEPER } from "../constants/action-types";
import { LANGUAGE_CHANGED } from "../constants/action-types";
import { IN_GAME_USER_FIELD_ACTIONS } from '../constants/in-game-user-field-actions';
import L from "../localization/Localization";
import GameSettings from "../models/GameSettings";
import {seedBombs, createFields, checkIfGameWon, getFieldByCoordinates, openField} from '../utils/utils';

export const gameInitial = {
    fields: [],
    time: 0,
    flags: 0,
    started: false,
    finished: false,
    won: false,
};

export const initialState = {
    globalSettings: {
        language: L.getLanguage(),
    },
    gameSettings: new GameSettings(),
    game: {...gameInitial},
};

export const rootReducer = (state = initialState, action) => {
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

            return { ...state, game: {...gameInitial} };
        }
        case MINESWEEPER.UPDATE_GAME_TIME: {

            // updating game time
            return { ...state, game: {...state.game, time: action.payload } };
        }
        case MINESWEEPER.CHANGE_GAME_SETTINGS: {

            // resetting game when settings are selected and saving settings
            return { ...state, game: {...gameInitial}, gameSettings: action.payload };
        }
        case MINESWEEPER.PROCESS_USER_FIELD_ACTION: {

            const { game } = state;
            const { gameSettings } = state;
            const { x, y, userActionType } = action.payload;

            if (game.finished) {

                // if game is finished - do nothing
                return state;
            }

            if (!game.started) {

                // setting started property
                game.started = true;

                // if game not started yet - generate field
                game.fields = createFields(gameSettings.props);
            }

            // if first user primary action
            if (userActionType === IN_GAME_USER_FIELD_ACTIONS.PRIMARY && !game.fields.find(_ => _.isOpened)) {

                // seed bombs
                game.fields = seedBombs(game.fields, gameSettings.props, {x, y});
            }

            // getting field
            const field = getFieldByCoordinates(game.fields, x, y);

            if (field.isOpened) {

                // if field is opened - do nothing
                return state;
            }

            if (userActionType === IN_GAME_USER_FIELD_ACTIONS.PRIMARY) {

                if (field.isFlag || field.isQestion) {

                    // if field is flag or - question
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

            } else if (userActionType === IN_GAME_USER_FIELD_ACTIONS.SECONDARY) {

                if (field.isFlag) {

                    // if question is enabled in settings - change flag to a question, else, just remove flag
                    field.isQestion = gameSettings.isQuestionTileEnabled;
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

            } else {

                // if invalid IN_GAME_USER_FIELD_ACTIONS return state
                return state;
            }

            return { ...state, game: game };
        }
        default:
            return state;
    }
};

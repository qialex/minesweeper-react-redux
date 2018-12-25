// src/js/reducers/index.js
import { MINESWEEPER, LANGUAGE_CHANGED } from "../constants/action-types";
import L from "../localization/Localization";
import GameSettings from "../models/GameSettings";
import {seedBombs, createTiles, checkAllTitlesOpened, openTile} from '../utils/utils';
import stateInitial from '../constants/state';
import gameInitial from '../constants/game';


export const rootReducer = (state = stateInitial, action) => {
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
            const { tileIndex, isPrimaryAction } = action.payload;

            if (game.finished) {

                // if game is finished - do nothing
                return state;
            }

            if (!game.started) {

                // setting started property
                game.started = true;

                // if game not started yet - generate tile
                game.tiles = createTiles(gameSettings);
            }

            // if first user primary action
            if (isPrimaryAction && !game.tiles.find(_ => _.isOpened)) {

                // seed bombs
                game.tiles = seedBombs(game.tiles, gameSettings, tileIndex);
            }

            // getting tile
            const tile = game.tiles[tileIndex];

            if (tile.isOpened) {

                // if tile is opened - do nothing
                return state;
            }

            if (isPrimaryAction) {

                if (tile.isFlag || tile.isQestion) {

                    // if tile is flag or - question
                    return state;
                }

                if (tile.isBomb) {

                    // if clicked on bomb - finish game
                    game.finished = true;
                    tile.isOpened = true;
                } else {

                    // open tiles recursively
                    openTile(tile);

                    if (checkAllTitlesOpened(game.tiles)) {

                        game.tiles.map(tile => {

                            // placing flag on all tiles
                            if (tile.isBomb && !tile.isFlag) {
                                tile.isQuestion = false;
                                tile.isFlag = true;
                            }
                        });

                        // if game is won
                        game.finished = true;
                        game.won = true;
                    }
                }

            } else {

                if (tile.isFlag) {

                    const gameSettingsClass = new GameSettings(gameSettings);

                    // if question is enabled in settings - change flag to a question, else, just remove flag
                    tile.isQestion = gameSettingsClass.isQuestionTileEnabled;
                    tile.isFlag = false;
                    game.flags = game.flags - 1;

                } else if (tile.isQestion) {

                    // change question to nothing
                    tile.isQestion = false;
                    tile.isFlag = false;

                } else {

                    // change nothing to a flag
                    game.flags = game.flags + 1;
                    tile.isQestion = false;
                    tile.isFlag = true;
                }

            }

            return { ...state, game: game };
        }
        default:
            return state;
    }
};

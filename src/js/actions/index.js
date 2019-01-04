// src/js/actions/index.spec.js
import { MINESWEEPER } from "../constants/action-types";
import { LANGUAGE_CHANGED } from "../constants/action-types";

export const globalChangeLanguage = language => ({type: LANGUAGE_CHANGED, payload: language });

export const resetGame = () => ({ type: MINESWEEPER.RESET_GAME });
export const changeGameSettings = gameSettings => ({ type: MINESWEEPER.CHANGE_GAME_SETTINGS, payload: gameSettings });
export const updateGameTime = time => ({ type: MINESWEEPER.UPDATE_GAME_TIME, payload: time });
export const processFieldAction = userAction => ({ type: MINESWEEPER.PROCESS_USER_FIELD_ACTION, payload: userAction });
export const resetGameRecords = () => ({ type: MINESWEEPER.RESET_GAME_RECORDS });

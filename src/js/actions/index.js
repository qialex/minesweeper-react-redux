// src/js/actions/index.js
import { MINESWEEPER } from "../constants/action-types";
import { LANGUAGE_CHANGED } from "../constants/action-types";

export const globalChangeLanguage = language => ({type: LANGUAGE_CHANGED, payload: language });

export const resetGame = () => ({ type: MINESWEEPER.RESET_GAME });
export const changeGameSettings = gameSettings => ({ type: MINESWEEPER.CHANGE_GAME_SETTINGS, payload: gameSettings });
export const updateGameTime = time => ({ type: MINESWEEPER.UPDATE_GAME_TIME, payload: time });
export const processLeftClick = coordinates => ({ type: MINESWEEPER.PROCESS_LEFT_CLICK, payload: coordinates });
export const processRightClick = coordinates => ({ type: MINESWEEPER.PROCESS_RIGHT_CLICK, payload: coordinates });
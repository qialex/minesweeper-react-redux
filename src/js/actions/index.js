// src/js/actions/index.js
import { MINESWEEPER } from "../constants/action-types";


export const resetGame = () => ({ type: MINESWEEPER.RESET_GAME });
export const changeSettings = settings => ({ type: MINESWEEPER.CHANGE_SETTINGS, payload: settings });
export const updateGameTime = time => ({ type: MINESWEEPER.UPDATE_GAME_TIME, payload: time });
export const processLeftClick = coordinates => ({ type: MINESWEEPER.PROCESS_LEFT_CLICK, payload: coordinates });
export const processRightClick = coordinates => ({ type: MINESWEEPER.PROCESS_RIGHT_CLICK, payload: coordinates });
import L from "../localization/Localization";
import GameSettings from "../models/GameSettings";
import gameInitial from "./game";


const stateInitial = {
    globalSettings: {
        language: localStorage.getItem('language') || L.getLanguage(),
    },
    gameSettings: new GameSettings().props,
    game: {...gameInitial},
};
export default stateInitial;

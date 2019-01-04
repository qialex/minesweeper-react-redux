import L from "../localization/Localization";
import GameSettings from "../models/GameSettings";
import GameRecords from "../models/GameRecords";
import gameInitial from "./game";


const stateInitial = {
    globalSettings: {
        language: localStorage.getItem('language') || L.getLanguage(),
    },
    gameSettings: new GameSettings().props,
    gameRecordsSimple: new GameRecords().simplified,
    game: {...gameInitial},
};
export default stateInitial;

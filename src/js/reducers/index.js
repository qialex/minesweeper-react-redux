// src/js/reducers/index.js
import { MINESWEEPER } from "../constants/action-types";


const initialState = {
    settings: {
        x: 3,
        y: 3,
        bombs: 8
    },
    game: {
        fields: undefined,
        time: 0,
        flags: 0,
        started: false,
        finished: false,
        won: false,
    },
};
function openField(field) {
    if (!field.isOpened) {
        field.isOpened = true;
        if (!field.number) {
            field.neighbors.filter(f => {
                f.isFlag = false;
                f.isQestion = false;
                openField(f);
            })
        }
    }
}
function getFieldBycoordinates(fields, x, y) {
    return fields && fields.length && fields.find(field => field.x === x && field.y === y);
}

function checkIfGameWon(fields) {
    return !fields.filter(_ => !_.isOpened && !_.isBomb).length;
}

function getNeighbors(fields, field) {
    //console.log (fields)
    //console.log (getFieldBycoordinates(fields, field.x-1, fields.y-1))
    return [
        getFieldBycoordinates(fields, field.x-1, field.y-1),
        getFieldBycoordinates(fields, field.x,   field.y-1),
        getFieldBycoordinates(fields, field.x+1, field.y-1),
        getFieldBycoordinates(fields, field.x-1, field.y  ),
        getFieldBycoordinates(fields, field.x+1, field.y  ),
        getFieldBycoordinates(fields, field.x-1, field.y+1),
        getFieldBycoordinates(fields, field.x,   field.y+1),
        getFieldBycoordinates(fields, field.x+1, field.y+1),
    ].filter(field => !!field);
}
function generateBombs(fieldsCount, bombsCount, exceptNumber) {
    console.log (bombsCount)
    //console.log (exceptNumber)
    const candidates = [...Array(fieldsCount).keys()]; // 0, 1, 2 ... fieldsCount
    //console.log (candidates);
    // console.log (candidates[candidates.indexOf(exceptNumber)]);
    [candidates[candidates.indexOf(exceptNumber)], candidates[candidates.length - 1]] = [candidates[candidates.length - 1], candidates[candidates.indexOf(exceptNumber)]];
    // console.log (candidates)
    candidates.length = candidates.length - 1;
    //console.log (candidates)

    return Array(bombsCount).fill()
        .map(() => {
            const randomIndex = Math.floor(Math.random() * candidates.length);
            const n = candidates[randomIndex];
            candidates[randomIndex] = candidates[candidates.length - 1];
            candidates.length = candidates.length - 1;
            return n;
        })
        .sort((a, b) => a - b) // sort if needed
}
function createFields(settings) {
    const fields = [];
    for (let x=0; x<settings.x; x++) {
        for (let y=0; y<settings.y; y++) {
            fields.push({
                x: x,
                y: y,
                isBomb: false,
                isFlag: false,
                isQuestion: false,
                isOpened: false,
                number: undefined,
                neighbors: []
            })
        }
    }
    return fields;
}

function seedBombs(fields, settings, bombExceptNumber) {
    const bombNumbers = generateBombs(settings.x*settings.y, settings.bombs, bombExceptNumber);
    // console.log (bombNumbers);
    return fields
        .map((field, i) => {
            field.isBomb = !!~bombNumbers.indexOf(i);
            return field;
        })
        .map(field => {
            field.neighbors = getNeighbors(fields, field);
            if (!field.isBomb) {
                field.number = field.neighbors.filter(f => f.isBomb).length;
            }
            return field;
        });
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case MINESWEEPER.RESET_GAME: {
            let { game } = state;

            if (!game.started) {
                return state;
            }

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
            let { game } = state;
            console.log (action.payload);
            game.time = action.payload;
            return { ...state, game: game };
        }
        case MINESWEEPER.CHANGE_SETTINGS: {
            const game = {
                fields: undefined,
                time: 0,
                flags: 0,
                started: false,
                finished: false,
                won: false,
            };
            return { ...state, game: game, settings: action.payload };
        }
        case MINESWEEPER.PROCESS_LEFT_CLICK: {
            // console.log(state);
            // console.log(action);
            const { game } = state;
            const { settings } = state;
            const { x, y } = action.payload;

            if (!game.started) {
                game.fields = createFields(settings);
                game.fields = seedBombs(game.fields, settings, settings.y*x + y);
                console.log (game.fields);
                game.started = true;
                game.finished = false;
                game.won = false;
            }

            if (game.started && game.fields && game.fields.length && !game.fields.find(_ => _.isBomb)) {
                game.fields = seedBombs(game.fields, settings, settings.y*x + y);
            }

            const field = getFieldBycoordinates(game.fields, x, y);
            if (game.finished || field.isOpened || field.isFlag || field.isQestion) {
                return state;
            }

            if (field.isBomb) {
                game.finished = true;
                field.isOpened = true;
            } else {
                openField(field);
                if (checkIfGameWon(game.fields)) {
                    game.finished = true;
                    game.won = true;
                }
            }

            return { ...state, game: game };
        }
        case MINESWEEPER.PROCESS_RIGHT_CLICK: {
            const { game, settings } = state;
            const { x, y } = action.payload;

            if (game.finished) {
                return state;
            }

            if (!game.started) {
                game.fields = createFields(settings);
                console.log (game.fields);
                game.started = true;
                game.finished = false;
                game.won = false;
            }

            const field = getFieldBycoordinates(game.fields, x, y);
            if (field.isOpened) {
                return state;
            }

            if (field.isFlag) {
                field.isQestion = true;
                field.isFlag = false;
                game.flags = game.flags - 1;
            } else if (field.isQestion) {
                field.isQestion = false;
                field.isFlag = false;
            } else {
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
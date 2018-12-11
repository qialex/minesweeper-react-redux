// src/js/utils/utils.js

const getNeighbors = (fields, field) => {

    // array of neighbors
    return [
        getFieldByCoordinates(fields, field.x-1, field.y-1),
        getFieldByCoordinates(fields, field.x,   field.y-1),
        getFieldByCoordinates(fields, field.x+1, field.y-1),
        getFieldByCoordinates(fields, field.x-1, field.y  ),
        getFieldByCoordinates(fields, field.x+1, field.y  ),
        getFieldByCoordinates(fields, field.x-1, field.y+1),
        getFieldByCoordinates(fields, field.x,   field.y+1),
        getFieldByCoordinates(fields, field.x+1, field.y+1),
    ].filter(field => !!field);
};

const generateBombs = (settings, clickedCoordinates) => {

    // field size
    const fieldsCount = settings.x*settings.y;

    // mines count
    const bombsCount = settings.bombs;

    // getting except number from coordinates
    const exceptNumber = settings.y*clickedCoordinates.x + clickedCoordinates.y;

    // candidates to be a bomb
    const candidates = [...Array(fieldsCount).keys()]; // 0, 1, 2 ... fieldsCount

    // to avoid using splice that might be hard on big arrays we will switch lats element and exceptNumber
    [candidates[candidates.indexOf(exceptNumber)], candidates[candidates.length - 1]] = [candidates[candidates.length - 1], candidates[candidates.indexOf(exceptNumber)]];

    // and than just remove last element
    candidates.length = candidates.length - 1;

    return Array(bombsCount).fill() // looping with bombsCount as iteration number
        .map(() => {

            // random index
            const randomIndex = Math.floor(Math.random() * candidates.length);

            // saving result
            const result = candidates[randomIndex];

            // again, to avoid splice, switching elements positions
            [candidates[randomIndex], candidates[candidates.length - 1]] = [candidates[candidates.length - 1], candidates[randomIndex]];

            // and than just remove last element
            candidates.length = candidates.length - 1;

            return result;
        })
        .sort((a, b) => a - b)
};

export const openField = (field) => {

    if (!field.isOpened) {

        // open field
        field.isOpened = true;

        // if field is empty
        if (!field.number && field.neighbors) {

            // open neighbors
            field.neighbors
                .map(f => {

                    if (!f.isOpened) {

                        f.isFlag = false;
                        f.isQestion = false;

                        // recursively
                        openField(f);
                    }

                })
        } else {

            return
        }
    } else {

        return
    }
};

export const getFieldByCoordinates = (fields, x, y) => {

    // getting a field by coordinates
    return fields && fields.length && fields.find(field => field.x === x && field.y === y);
};

export const checkIfGameWon = (fields) => {

    // if there is no unopened and not mine fields
    return !fields.filter(_ => !_.isOpened && !_.isBomb).length;
};

export const createFields = (settings) => {

    const fields = [];

    // looping field size
    for (let x=0; x<settings.x; x++) {

        for (let y=0; y<settings.y; y++) {

            // pushing field
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
};

export const seedBombs = (fields, settings, clickedCoordinates) => {

    // array with numbers of bombs
    const bombNumbers = generateBombs(settings, clickedCoordinates);

    // placing mines
    fields = fields.map((field, i) => ({...field, isBomb: !!~bombNumbers.indexOf(i)}));

    return fields.map(field => {

        // getting neighbors for a tile
        field.neighbors = getNeighbors(fields, field);

        if (!field.isBomb) {

            // placing number is field not a bomb
            field.number = field.neighbors.filter(f => f.isBomb).length;

            if (field.number) {

                // removing neighbors because they are no longer need
                field.neighbors = undefined;
            }
        }

        return field;
    });
};

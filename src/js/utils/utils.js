// src/js/utils/utils.js
import GameSettings from '../models/GameSettings';
import tileInitial from '../constants/tile';

export const createTiles = (props) => {

    // getting gameSettings
    const gameSettings = new GameSettings(props);

    // creating array of empty tiles
    return new Array(gameSettings.tilesCount).fill({...tileInitial});
};

export const seedBombs = (tiles, settings, tileIndex) => {

    // getting gameSettings
    const gameSettings = new GameSettings(settings);

    const generateBombs = (exceptNumber) => {

        // field size
        const tilesCount = gameSettings.tilesCount;

        // mines count
        const bombsCount = settings.bombs;

        // candidates to be a bomb
        const candidates = [...Array(tilesCount).keys()]; // 0, 1, 2 ... tilesCount

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

    const getNeighbors = (tiles, rowLength, tileIndex) => {

        // top and bottom neighbors
        let neighbors = [tiles[tileIndex - rowLength], tiles[tileIndex + rowLength]];

        // neighbors from the left
        if (tileIndex % rowLength) {
            neighbors = [...neighbors, tiles[tileIndex - rowLength - 1], tiles[tileIndex - 1], tiles[tileIndex + rowLength - 1]]
        }

        // neighbors from the right
        if ((tileIndex + 1) % rowLength) {
            neighbors = [...neighbors, tiles[tileIndex - rowLength + 1], tiles[tileIndex + 1], tiles[tileIndex + rowLength + 1]]
        }

        return neighbors.filter(_ => !!_);
    };

    // array with numbers of bombs
    const bombNumbers = generateBombs(tileIndex);

    // placing mines
    tiles = tiles.map((tile, i) => ({...tile, isBomb: !!~bombNumbers.indexOf(i)}));

    return tiles.map((tile, i) => {

        // if not a bomb
        if (!tile.isBomb) {

            // getting neighbors for a tile
            tile.neighbors = getNeighbors(tiles, gameSettings.rowLength, i);

            // placing number is tile not a bomb
            tile.number = tile.neighbors.filter(f => f.isBomb).length;

            if (tile.number) {

                // removing neighbors because they are no longer need
                tile.neighbors = undefined;
            }
        }

        return tile;
    });
};

// TODO : not tested yet
export const openTile = (tile) => {

    if (!tile.isOpened) {

        // open tile
        tile.isOpened = true;

        // if tile is empty
        if (!tile.number && tile.neighbors) {

            // open neighbors
            tile.neighbors
                .map(f => {

                    if (!f.isOpened) {

                        f.isFlag = false;
                        f.isQestion = false;

                        // recursively
                        openTile(f);
                    }

                })
        } else {

            return
        }
    } else {

        return
    }
};

export const checkAllTitlesOpened = (tiles) => {

    // if there is no unopened and not mine tiles
    return !tiles.filter(tile => !tile.isOpened && !tile.isBomb).length;
};

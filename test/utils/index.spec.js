import {createTiles, seedBombs, checkAllTitlesOpened, openTile} from '../../src/js/utils/utils';
import GameSettings from '../../src/js/models/GameSettings';
import tileInitial from '../../src/js/constants/tile';


describe('actions', () => {

    it('createTiles should create an array of empty tiles', () => {

        // creating game setting
        const gameSettings = new GameSettings();

        // creating tiles setting
        const tiles = createTiles(gameSettings.props);

        // should be related to tilesCount
        expect(tiles.length).toEqual(gameSettings.tilesCount);

        // looping tiles, each
        tiles.map(tile => {

            // should be equal to tileInitial
            expect(tile).toEqual(tileInitial);
        })
    });

    it('seedBombs should fill tiles', () => {

        // creating game setting
        const gameSettings = new GameSettings();

        const tileWithoutBombNumber = (Math.random() * gameSettings.tilesCount) << 0;

        // creating tiles setting
        let tiles = createTiles(gameSettings.props);

        // seeding maximum amount of bombs
        tiles = seedBombs(tiles, {...gameSettings.props, [gameSettings.publicProps.find(prop => !prop.isSizeProp).code]: gameSettings._maxBombs}, tileWithoutBombNumber);

        // amount of tiles with bombs should be queal to gameSettings._maxBombs
        expect(tiles.filter(tile => tile.isBomb).length).toEqual(gameSettings._maxBombs);

        // tile number tileWithoutBombNumber should be not a bomb
        expect(tiles[tileWithoutBombNumber].isBomb).toBeFalsy();
    });

    it('checkAllTitlesOpened should correctly check weather if game is won', () => {

        // creating game setting
        const gameSettings = new GameSettings();

        const tileWithoutBombNumber = (Math.random() * gameSettings.tilesCount) << 0;

        // creating tiles setting
        let tiles = createTiles(gameSettings.props);

        // seeding maximum amount of bombs
        tiles = seedBombs(tiles, {...gameSettings.props, [gameSettings.publicProps.find(prop => !prop.isSizeProp).code]: gameSettings._maxBombs}, tileWithoutBombNumber);

        // checking if all possible tiles are opened
        expect(checkAllTitlesOpened(tiles)).toBeFalsy();

        // setting only tile isOpened
        tiles[tileWithoutBombNumber].isOpened = true;

        // checking again if all possible tiles are opened
        expect(checkAllTitlesOpened(tiles)).toBeTruthy();
    });
});
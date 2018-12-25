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

        // random tile with a bomb number
        const tileWithoutBombNumber = (Math.random() * gameSettings.tilesCount) << 0;

        // random bombsCount
        const bombsCount = (Math.random() * (gameSettings._maxBombs + gameSettings._constants.minBombs) - gameSettings._constants.minBombs) << 0;

        // creating tiles setting
        let tiles = createTiles(gameSettings.props);

        // seeding maximum amount of bombs
        tiles = seedBombs(tiles, {...gameSettings.props, [gameSettings.publicProps.find(prop => !prop.isSizeProp).code]: bombsCount}, tileWithoutBombNumber);

        // amount of tiles with bombs should be queal to gameSettings._maxBombs
        expect(tiles.filter(tile => tile.isBomb).length).toEqual(bombsCount);

        // tile number tileWithoutBombNumber should be not a bomb
        expect(tiles[tileWithoutBombNumber].isBomb).toBeFalsy();
    });

    it('checkAllTitlesOpened should correctly check weather if game is won', () => {

        // creating game setting
        const gameSettings = new GameSettings();

        // random tile with a bomb number
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

    it('openTile should correctly open tile(s)', () => {

        // default props for field, just for sure that we have a big enough field with one bombs
        const defaultProps = [8,8,1];

        // creating game setting for constants
        const gameSettingsTemporary = new GameSettings();

        // setting default props
        gameSettingsTemporary.presets[0]._props = defaultProps;

        // creating game setting
        const gameSettings = new GameSettings(gameSettingsTemporary.presets[0].props);

        const tileWithoutBombNumber = 0;

        // creating tiles setting
        let tiles = createTiles(gameSettings.props);

        // seeding bombs
        tiles = seedBombs(tiles, gameSettings.props, tileWithoutBombNumber);

        // getting tile with number
        const tileWithNumber = tiles.find(_ => _.number);

        // opening tileWithNumber
        openTile(tileWithNumber);

        // tileWithNumber should be opened
        expect(tileWithNumber.isOpened).toBeTruthy();

        // should be just one opened tile
        expect(tiles.filter(_ => _.isOpened).length).toBe(1);

        // getting tile with number
        const tileEmpty = tiles.find(_ => !_.number && !_.isBomb);

        // opening tileWithNumber
        openTile(tileEmpty);

        // tileEmpty should be opened
        expect(tileEmpty.isOpened).toBeTruthy();

        // there should be no unopened empty tiles
        expect(tiles.find(_ => !_.isOpened && !_.number && !_.isBomb)).toBeUndefined();
    });
});
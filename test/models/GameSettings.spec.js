// test/models/GameSettings.js
import GameSettings from "../../src/js/models/GameSettings";


describe('models->GameSettings', () => {

    it('should create an instance', () => {

        // creating gameSettings
        expect(new GameSettings()).toBeDefined();
    });

    it('should have valid constants', () => {

        // creating gameSettings
        const gameSettings = new GameSettings();

        // constants exist
        expect(gameSettings._constants).toBeDefined();

        // isQuestionTileEnabled exist
        expect(gameSettings._constants.isQuestionTileEnabled).toBeDefined();

        // isQuestionTileEnabled exist
        expect(gameSettings.isQuestionTileEnabled).toBeDefined();

        // isQuestionTileEnabled exist
        expect(gameSettings._constants.isQuestionTileEnabled).toBe(gameSettings.isQuestionTileEnabled);

        // isQuestionTileEnabled is boolean
        expect(typeof gameSettings.isQuestionTileEnabled).toBe('boolean');

        // publicProps exist
        expect(gameSettings._constants.publicProps).toBeDefined();

        // .publicProps and _constants.publicProps should be equal
        expect(gameSettings._constants.publicProps).toEqual(gameSettings.publicProps);

        // 3 publicProps
        expect(gameSettings.publicProps.length).toBe(3);

        // each public prop
        gameSettings.publicProps.map(prop => {

            // public prop object should contain at lease 2 properties
            expect(Object.keys(prop).length).toBeGreaterThanOrEqual(2);

            // .code should be a string
            expect(typeof prop.code).toBe('string');

            // .L_key should be a string
            expect(typeof prop.L_key).toBe('string');
        });

        // 2 publicProps are field size
        expect(gameSettings.publicProps.filter(_ => _.isSizeProp).length).toBe(2);

        // each field size public prop
        gameSettings.publicProps
            .filter(_ => _.isSizeProp)
            .map(prop => {

                // public prop object should at lease 3 properties
                expect(Object.keys(prop).length).toBeGreaterThanOrEqual(3);

                // .isSizeProp should be a boolean
                expect(typeof prop.isSizeProp).toBe('boolean');
            });

        // 1 publicProp is isRowLength
        expect(gameSettings.publicProps.filter(_ => _.isRowLength).length).toBe(1);

        // each field size public prop
        gameSettings.publicProps
            .filter(_ => _.isRowLength)
            .map(prop => {

                // public prop object should at lease 4 properties
                expect(Object.keys(prop).length).toBe(4);

                // .isSizeProp should be a boolean
                expect(typeof prop.isRowLength).toBe('boolean');
            });

        // minFieldSize should be defined
        expect(gameSettings._constants.minFieldSize).toBeDefined();

        // and more or equal than 2
        expect(gameSettings._constants.minFieldSize).toBeGreaterThanOrEqual(2);

        // and less or equal than 32
        expect(gameSettings._constants.minFieldSize).toBeLessThanOrEqual(32);

        // maxFieldSize should be defined
        expect(gameSettings._constants.maxFieldSize).toBeDefined();

        // and more or equal than 2
        expect(gameSettings._constants.maxFieldSize).toBeGreaterThanOrEqual(2);

        // and less or equal than 32
        expect(gameSettings._constants.maxFieldSize).toBeLessThanOrEqual(32);

        // min should be less or equal than max
        expect(gameSettings._constants.minFieldSize).toBeLessThanOrEqual(gameSettings._constants.maxFieldSize);

        // minBombs should be defined
        expect(gameSettings._constants.minBombs).toBeDefined();

        // minBombs should be less than min * max
        expect(gameSettings._constants.minBombs).toBeLessThan(gameSettings._constants.minFieldSize * gameSettings._constants.minFieldSize);

        // presets should be defined
        expect(gameSettings._constants.presets).toBeDefined();

        // .presets and _constants.presets should be equal
        expect(gameSettings._constants.presets).toEqual(gameSettings.presets);

        // should be at least 2 presets
        expect(gameSettings.presets.length).toBeGreaterThanOrEqual(2);

        // all presets should have
        gameSettings.presets.map(preset => {

            // .code to be string
            expect(typeof preset.code).toBe('string');

            // .L_key to be string
            expect(typeof preset.L_key).toBe('string');
        });

        // at least one preset with field size
        expect(gameSettings.presets.filter(preset => preset._props).length).toBeGreaterThanOrEqual(1);

        // it should be a first one
        expect(gameSettings.presets[0]._props).toBeDefined();

        // one and only one custom preset
        expect(gameSettings.presets.filter(preset => !preset._props).length).toBe(1);

        // presets with fields size should
        gameSettings.presets
            .filter(preset => preset._props)
            .map(preset => {

                // _props to be
                expect(preset._props).toBeDefined();

                // _props should be an array with publicProps.length elements
                expect(preset._props.length).toBe(gameSettings.publicProps.length);

                preset._props.map(_ => {

                    // all are numbers
                    expect(typeof _).toBe('number');
                });

                // props to be
                expect(preset.props).toBeDefined();

                // props should be an object with 3 properties
                expect(Object.keys(preset.props).length).toBe(3);

                // and each
                gameSettings.publicProps.map(prop => {

                    // should be related to the .publicProps
                    expect(preset.props[prop.code]).toBeDefined();

                    // properties related to the field size should be
                    if (prop.isSizeProp) {

                        // greater or equal than gameSettings._constants.minFieldSize
                        expect(preset.props[prop.code]).toBeGreaterThanOrEqual(gameSettings._constants.minFieldSize);

                        // less or equal than gameSettings._constants.maxFieldSize
                        expect(preset.props[prop.code]).toBeLessThanOrEqual(gameSettings._constants.maxFieldSize);

                    } else {

                        // mines count should be greater or equal than .minBombs
                        expect(preset.props[prop.code]).toBeGreaterThanOrEqual(gameSettings._constants.minBombs);

                        // mines count should be less or equal than field size
                        expect(preset.props[prop.code]).toBeLessThanOrEqual(gameSettings._constants.maxFieldSize * gameSettings._constants.maxFieldSize);
                    }
                })
            })

        // tilesCount exist
        expect(gameSettings.tilesCount).toBeDefined();

        // tilesCount is number
        expect(typeof gameSettings.tilesCount).toBe('number');

        // bombs exist
        expect(gameSettings.bombs).toBeDefined();

        // bombs is number
        expect(typeof gameSettings.bombs).toBe('number');

        // rowLength exist
        expect(gameSettings.rowLength).toBeDefined();

        // rowLength is number
        expect(typeof gameSettings.rowLength).toBe('number');
    });

    it('should create a GameSettings with correct .props', () => {

        // creating gameSettings
        const gameSettings = new GameSettings();

        // .props should be
        expect(gameSettings.props).toBeDefined();

        // .props properties length should be the same as in constants
        expect(Object.keys(gameSettings.props).length).toBe(gameSettings.publicProps.length);

        // every .props property should be
        Object.keys(gameSettings.props).filter(prop => {

            // related to the .publicProps
            expect(gameSettings.publicProps.find(_ => _.code === prop)).toBeDefined();

            // value should be a number
            expect(typeof gameSettings.props[prop]).toBe('number');

        })
    });

    it('should create a GameSettings without input', () => {

        // creating gameSettings
        const gameSettings = new GameSettings();

        // value based on first preset
        const expectedObject = gameSettings.presets[0].props;

        // should ave same .props
        expect(gameSettings.props).toEqual(expectedObject)
    });

    it('should create GameSettings from first preset using invalid preset code', () => {

        // creating gameSettings
        const gameSettings = new GameSettings('ololo');

        // value based on first preset
        const expectedObject = gameSettings.presets[0].props;

        // should have same .props
        expect(gameSettings.props).toEqual(expectedObject)
    });

    it('should create a correct GameSettings using correct preset code', () => {

        // creating gameSettings to get _constants
        const gameSettings = new GameSettings();

        // looping .presets
        gameSettings.presets
            .filter(preset => preset._props)
            .map(preset => {

                // creating GameSettings based on preset code
                let gameSettingsInner = new GameSettings(preset.code);

                // should have same .props
                expect(gameSettingsInner.props).toEqual(preset.props)
            });

        // creating new gameSettings from preset code
        const gameSettingsSpecial = new GameSettings(gameSettings.presets.find(preset => !preset._props).code);

        // should be equal to the first preset original preset
        expect(gameSettings.presets[0]).toEqual(gameSettingsSpecial.preset);
    });

    it('should create a correct GameSettings using correct object', () => {

        // creating gameSettings to get _constants
        const gameSettings = new GameSettings();

        // creating GameSettings based on preset code
        const gameSettings2 = new GameSettings(gameSettings.presets[0].props);

        // should have same .props
        expect(gameSettings2.props).toEqual(gameSettings.presets[0].props)
    });

    it('should create GameSettings from first preset using incorrect object', () => {

        // creating gameSettings with invalid object
        const gameSettings = new GameSettings({ololo: 'ururu'});

        // should have same .props
        expect(gameSettings.props).toEqual(gameSettings.presets[0].props)
    });

    it('should create valid _sizeProps getter for GameSettings', () => {

        // creating gameSettings
        const gameSettings = new GameSettings();

        // should have same ._sizeProps
        expect(gameSettings._sizeProps).toEqual(
            gameSettings.publicProps
                .filter(prop => prop.isSizeProp)
                .map(prop => prop.code)
        )
    });

    it('should create valid tilesCount getter for GameSettings', () => {

        // creating gameSettings
        const gameSettings = new GameSettings();

        // should have same .tilesCount
        expect(gameSettings.tilesCount).toEqual(
            gameSettings.publicProps
                .filter(prop => prop.isSizeProp)
                .map(prop => gameSettings[`_${prop.code}`])
                .reduce((total, current) => total * current, 1)
        )
    });

    it('should create valid _maxBombs getter for GameSettings', () => {

        // creating gameSettings
        const gameSettings = new GameSettings();

        // should have same ._maxBombs
        expect(gameSettings._maxBombs).toEqual(
            gameSettings.publicProps
                .filter(prop => prop.isSizeProp)
                .map(prop => gameSettings[`_${prop.code}`])
                .reduce((total, current) => total * current, 1)
                - 1
        )
    });

    it('should create valid bombs getter for GameSettings', () => {

        // creating gameSettings
        const gameSettings = new GameSettings();

        // should be equal to bombs from first preset
        expect(gameSettings.bombs).toEqual(gameSettings.preset._props[gameSettings.preset._props.length - 1])
    });

    it('should create valid rowLength getter for GameSettings', () => {

        // creating gameSettings
        const gameSettings = new GameSettings();

        // should be equal to bombs from first preset
        expect(gameSettings.rowLength).toEqual(gameSettings.preset._props[0])
    });

    it('should correctly count min an max for props GameSettings._getMinMax() and .minmax', () => {

        // creating gameSettings
        const gameSettings = new GameSettings();

        // getter .minmax to be defined
        expect(gameSettings.minmax).toBeDefined();

        // looping .minmax properties, each
        gameSettings.publicProps.map(prop => {

            // should be related to .publicProps
            expect(gameSettings.minmax[prop.code]).toBeDefined();

            // min should be defined
            expect(gameSettings.minmax[prop.code].min).toBeDefined();

            // min should be a number
            expect(typeof gameSettings.minmax[prop.code].min).toBe('number');

            // .min should be equal to ._getMinMax
            expect(gameSettings.minmax[prop.code].min).toBe(gameSettings._getMinMax(prop.code).min);

            // for size property
            if (prop.isSizeProp) {

                // .min should be equal to .minFieldSize
                expect(gameSettings.minmax[prop.code].min).toBe(gameSettings._constants.minFieldSize)
            } else {

                // .min should be equal to .minBombs
                expect(gameSettings.minmax[prop.code].min).toBe(gameSettings._constants.minBombs);
            }

            // max should be defined
            expect(gameSettings.minmax[prop.code].max).toBeDefined();

            // max should be a number
            expect(typeof gameSettings.minmax[prop.code].max).toBe('number');

            // .max should be equal to ._getMinMax
            expect(gameSettings.minmax[prop.code].max).toBe(gameSettings._getMinMax(prop.code).max);

            // for size property
            if (prop.isSizeProp) {

                // .max should be equal to .maxFieldSize
                expect(gameSettings.minmax[prop.code].max).toBe(gameSettings._constants.maxFieldSize);
            } else {

                // .max should be equal to ._maxBombs
                expect(gameSettings.minmax[prop.code].max).toBe(gameSettings._maxBombs);
            }
        });
    });

    it('should correctly return GameSettings.preset', () => {

        // creating gameSettings
        const gameSettings = new GameSettings();

        // looping presets
        gameSettings.presets
            .filter(preset => preset._props)
            .map(preset => {

                // creating new gameSettings from preset code
                const gameSettings2 = new GameSettings(preset.code);

                // creating new gameSettings from preset props
                const gameSettings3 = new GameSettings(preset.props);

                // should be equal to original preset
                expect(preset).toEqual(gameSettings2.preset);

                // should be equal to original preset
                expect(preset).toEqual(gameSettings3.preset);
            });


        // getting props from first preset
        const inpresetProps = gameSettings.presets[0].props;

        // changing first value
        inpresetProps[Object.keys(inpresetProps)[0]]++;

        // creating gameSettings based on most likely no-preset data
        const gameSettings2 = new GameSettings(inpresetProps);

        // current .preset should not have ._props
        expect(gameSettings2.preset._props).toBeUndefined();
    });

    it('should have correct validation function in GameSettings', () => {

        // creating gameSettings
        const gameSettings = new GameSettings();

        // correct validation should return object
        expect(typeof gameSettings.validation).toBe('object');

        // array
        expect(typeof gameSettings.validation.length).toBe('number');

        // empty
        expect(gameSettings.validation.length).toBe(0);

        const INCORRECT_VALUE = -100;

        // getting props from first preset
        const inpresetProps = gameSettings.presets[0].props;

        // changing first value
        inpresetProps[Object.keys(inpresetProps)[0]] = INCORRECT_VALUE;

        // changing first value
        inpresetProps[Object.keys(inpresetProps)[1]] = INCORRECT_VALUE;

        // changing first value
        inpresetProps[Object.keys(inpresetProps)[2]] = INCORRECT_VALUE;

        // creating gameSettings based on incorrect props
        const gameSettings2 = new GameSettings(inpresetProps);

        // current .preset should not have ._props
        expect(gameSettings2.validation.length).toBe(3);

        // looping validation, each
        gameSettings2.validation.map(validation => {

            // should be an object
            expect(typeof validation).toBe('object');

            // .prop should be defined
            expect(validation.prop).toBeDefined();

            // .prop should be a string
            expect(typeof validation.prop).toBe('string');

            // validation.prop should be related to .publicProps
            expect(gameSettings2.publicProps.find(prop => prop.code === validation.prop)).toBeDefined();

            // .value should be defined
            expect(validation.value).toBeDefined();

            // .value should be a number
            expect(typeof validation.value).toBe('number');

            // .value should be equal to INCORRECT_VALUE
            expect(validation.value).toBe(INCORRECT_VALUE);

            // .min should be defined
            expect(validation.min).toBeDefined();

            // .min should be a number
            expect(typeof validation.min).toBe('number');

            // .min should be a number
            expect(validation.min).toBe(gameSettings2.minmax[validation.prop].min);

            // .max should be defined
            expect(validation.max).toBeDefined();

            // .max should be a number
            expect(typeof validation.max).toBe('number');

            // .max should be a number
            expect(validation.max).toBe(gameSettings2.minmax[validation.prop].max);
        });
    });
});

// test/models/GameRecords.spec.js
import GameRecords, { GAME_RECORDS_LOCAL_STORAGE_KEY } from "../../src/js/models/GameRecords";
import { ConstGameSettings } from '../../src/js/models/GameSettings';



describe('models->GameRecords', () => {

    // defining gameRecords
    let gameRecords;

    beforeEach(() => {

        // creating gameRecords
        gameRecords = new GameRecords();
    });

    it('should create an instance', () => {

        // creating gameRecords
        expect(gameRecords).toBeDefined();
    });

    it('should have a getter .simplified', () => {

        // .simplified.length should be not less that amount of presets with props
        expect(gameRecords.simplified.length).toBeGreaterThanOrEqual(ConstGameSettings.presets.filter(preset => preset._props).length);

        // looping gameRecords
        gameRecords.simplified.map(record => {

            // ._props length should be equal to .publicProps.length
            expect(record._props.length).toBe(ConstGameSettings.publicProps.length);

            // .preset should be found in presets
            expect(ConstGameSettings.presets.find(preset => preset.code === record.preset.code)).toBeDefined();

            // .isRecord should be boolean
            expect(typeof record.isRecord).toBe(`boolean`);

            // .time length should be positive number
            expect(record.time).toBeGreaterThanOrEqual(0);
        })
    });

    it('should have getRecordByProps returning a record by props', () => {

        // looping ConstGameSettings.presets
        ConstGameSettings.presets
            .filter(preset => preset._props)
            .map(preset => {

                // getting record by props
                const record = gameRecords.getRecordByProps(preset._props);

                // ._props length should be equal to .publicProps.length
                expect(record._props.length).toBe(ConstGameSettings.publicProps.length);

                // .preset should be found in presets
                expect(ConstGameSettings.presets.find(preset => preset.code === record.preset.code)).toBeDefined();

                // .isRecord should be boolean
                expect(typeof record.isRecord).toBe(`boolean`);

                // .time length should be positive number
                expect(record.time).toBeGreaterThanOrEqual(0);
            });
    });

    it('should have isRecordCheck returning a boolean and addRecord saving a result', () => {

        // mockTime
        const mockTime = 10;

        // mockTimeGreater
        const mockTimeGreater = mockTime * 2;

        // looping gameRecords
        gameRecords.simplified.map(record => {

            // .isRecordCheck should be true for mock time
            expect(gameRecords.isRecordCheck(record._props, mockTime)).toBeTruthy();

            // adding record
            gameRecords.addRecord(record._props, mockTime);

            // .isRecord should be true
            expect(record.isRecord).toBeTruthy();

            // .time should be mockTime
            expect(record.time).toBe(mockTime);

            // .isRecordCheck should be false for mockTimeGreater
            expect(gameRecords.isRecordCheck(record._props, mockTimeGreater)).toBeFalsy();

            // trying to record with greater time
            gameRecords.addRecord(record._props, mockTimeGreater);

            // .time should stay untouched
            expect(record.time).toBe(mockTime);
        });
    });

    it('should properly reset records', () => {

        // resetting presets
        gameRecords.resetRecords();

        // should again have records count related to the presets
        expect(gameRecords.simplified).toHaveLength(ConstGameSettings.presets.filter(preset => preset._props).length);

        // no records should have time or isRecord
        expect(gameRecords.simplified.filter(record => record.time || record.isRecord)).toHaveLength(0);
    });

    it('should add new record for new props (also checking saving to a local storage)', () => {

        // mockTime
        const mockTime = 10;

        // mockProps
        const mockProps = ConstGameSettings.presets.find(preset => preset._props)._props.map(_ => _*2);

        // saving recordsCount
        const recordsCount = gameRecords.simplified.length;

        // adding record
        gameRecords.addRecord(mockProps, mockTime);

        // getting record
        const record = gameRecords.getRecordByProps(mockProps);

        // .time should be a mockTime
        expect(record.time).toBe(mockTime);

        // records count should be increased
        expect(gameRecords.simplified).toHaveLength(recordsCount + 1);
    });

    it('should properly handle invalid json in localStorage', () => {

        // mockTime
        const mockTime = 10;

        // mockProps
        const mockProps = ConstGameSettings.presets.find(preset => preset._props)._props.map(_ => _*2);

        // adding record
        gameRecords.addRecord(mockProps, mockTime);

        // now we should have more records than initially

        // invalidJson
        const invalidJson = '[invalid {json}';

        // setting invalidJson into localStorage
        localStorage.setItem(GAME_RECORDS_LOCAL_STORAGE_KEY, invalidJson);

        // resetting presets
        gameRecords = new GameRecords();

        // should again have records count related to the presets
        expect(gameRecords.simplified).toHaveLength(ConstGameSettings.presets.filter(preset => preset._props).length);

        // no records should have time or isRecord
        expect(gameRecords.simplified.filter(record => record.time || record.isRecord)).toHaveLength(0);
    });
});

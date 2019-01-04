// src/js/models/GameRecords.js
import { ConstGameSettings } from './GameSettings';

export const GAME_RECORDS_LOCAL_STORAGE_KEY = 'records';

const gameRecordInitial = {
    _props: [],
    preset: undefined,
    isRecord: false,
    time: 0,
};

class GameRecords {

    static _saveRecordsToLocalStorage(records) {

        // saving records to a localStorage
        localStorage.setItem(GAME_RECORDS_LOCAL_STORAGE_KEY, JSON.stringify(records))
    }

    static _findPresetForRecord(props) {
        return ConstGameSettings.presets.find(preset => preset._props && preset._props.join() === props.join())
            || ConstGameSettings.presets.find(preset => !preset._props)
    }

    static _transformLocalStorageToRecords(raw) {

        // trying to get data from localStorage
        try {

            // parse JSON and trying to find preset for a record
            return JSON.parse(raw)
                .map(record => {

                    // if not - getting custom
                    record.preset = GameRecords._findPresetForRecord(record._props);

                    // returning
                    return record;
                })
                .filter(record => record.isRecord || record.preset._props)
                .sort((a, b) => a._props.reduce((s, c) => s + +c, 0) - b._props.reduce((s, c) => s + +c, 0))
                .sort((a, b) => !!b.preset._props - !!a.preset._props)

        } catch (e) {

            // getting records from presets
            return GameRecords._transformPresetsToRecords();
        }
    }

    static _transformPresetsToRecords() {

        // getting records from presets
        return ConstGameSettings.presets
            .filter(preset => preset._props)
            .map(preset => ({...gameRecordInitial, _props: [...preset._props], preset}));
    }

    constructor(data) {

        if (data) {

            // if data passed
            this.records = data;

        } else {

            // raw data
            const raw = localStorage.getItem(GAME_RECORDS_LOCAL_STORAGE_KEY);

            if (raw) {

                // getting records from localStorage
                this.records = GameRecords._transformLocalStorageToRecords(raw);

            } else {

                // getting records from presets
                this.records = GameRecords._transformPresetsToRecords();
            }
        }
    }

    get simplified() {

        // just an object, no class
        return [...this.records];
    }

    getRecordByProps(props) {

        // trying to find a record
        return this.records.find(record => record._props.join() === props.join());
    }

    isRecordCheck(props, time) {

        // trying to find a record
        const record = this.getRecordByProps(props);

        // if no record, or time is less
        return time >= 0 && (!record || !record.isRecord || time < record.time);
    }

    addRecord(props, time) {

        if (this.isRecordCheck(props, time)) {

            // trying to find a record
            let record = this.getRecordByProps(props);

            if (!record) {

                // creating new record
                record = {...gameRecordInitial, _props: [...props], preset: GameRecords._findPresetForRecord(props)};

                // adding new record to a records
                this.records.push(record);
            }

            // updating record status
            record.isRecord = true;

            // updating time of current record
            record.time = time;


            // saving records to a localStorage
            GameRecords._saveRecordsToLocalStorage(this.records);
        }
    }

    resetRecords() {

        // getting records from presets
        this.records = GameRecords._transformPresetsToRecords();

        // saving records to a localStorage
        GameRecords._saveRecordsToLocalStorage(this.records);
    }
}
export default GameRecords;

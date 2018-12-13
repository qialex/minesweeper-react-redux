// src/js/models/GameSettings.js

import L from "../localization/Localization";
import React from "react";

const ConstGameSettings = {
    publicProps: [
        {
            code: 'x',
            L_key: 'settings_field_width',
        },
        {
            code: 'y',
            L_key: 'settings_field_height',
        },
        {
            code: 'bombs',
            L_key: 'settings_field_bombs_count',
        },
    ],
    sizeProps: [0, 1],
    minFieldSize: 2,
    maxFieldSize: 32,
    minBombs: 1,
    presets: [
        {
            code:  'beginner',
            props: [8, 8, 10],
            L_key: 'settings_beginner',
        },
        {
            code:  'intermediate',
            props: [16, 16, 40],
            L_key: 'settings_intermediate',
        },
        {
            code: 'expert',
            props: [16, 30, 99],
            L_key: 'settings_expert',
        },
        {
            code: 'custom',
            L_key: 'settings_custom',
        }
    ]
};

class GameSettings {

    _sizeProps() {

        return this._constants.sizeProps
            .map(index => this._constants.publicProps[index].code)
    }
    
    _maxBombs(props = false) {

        props = props || this;

        return this._sizeProps()
                .map(prop => props[prop])
                .reduce((p, current) => p * current, 1)
                - 1;
    }

    _validateProps() {

        const props = this.getData();

        Object.keys(props).filter(prop => {

            const minmax = this.getMinMax(prop);

            if (!props[prop] || props[prop] < minmax.min || props[prop] > minmax.max) {

                throw new Error(`GameSettings prop ${prop} (${props[prop]}) is not valid`);
            }
        })
    }

    constructor(data) {

        this._constants = ConstGameSettings;

        if (!data) {
            data = this.getPresetProps(this._constants.presets[0].code);
        }

        Object.keys(data)
            .filter(prop => ~this.getPublicProps().indexOf(prop))
            .map(prop => this[prop] = data[prop]);

        this._validateProps();
    }

    checkPossibleValue(property, value) {

        // doing new values set
        const props = {...this.getData(), [property]: value};

        Object.keys(props).filter(prop => {

            const minmax = this.getMinMax(prop, props);

            if (!props[prop]) {

                throw new Error(`GameSettings prop ${prop} (${props[prop]}) is not valid`);

            } else if (props[prop] < minmax.min) {

                props[prop] = minmax.min;

            } else if (props[prop] > minmax.max) {

                props[prop] = minmax.max;

            }
        });

        return props;
    }

    getData() {

        return this.getPublicProps()
            .reduce((result, prop) => ({...result, [prop]: this[prop]}), {});
    }

    getPublicProps() {

        return this._constants.publicProps.map(obj => obj.code);
    }

    getPublicProp(prop) {

        return this._constants.publicProps.find(obj => obj.code === prop);
    }

    getMinMax(prop, props = false) {

        if (~(this._sizeProps().indexOf(prop))) {

            return {min: this._constants.minFieldSize, max: this._constants.maxFieldSize}
        } else {

            return {min: this._constants.minBombs, max: this._maxBombs(props)}
        }
    }

    getPresets() {

        return this._constants.presets;
    }

    getPreset() {

        return this._constants.presets
            .find(preset => {

                const props = this.getPresetProps(preset.code);

                return this.getPublicProps()
                    .map(prop => {

                        return props && this[prop] === props[prop]
                    })
                    .reduce((init, current) => init && current, true)
            })
            || this._constants.presets[this._constants.presets.length - 1];
    }

    getPresetProps(presetCode) {

        const publicProps = this.getPublicProps();

        const presetProps = this._constants.presets
            .find(preset => preset.code === presetCode)
            .props;

        return !presetProps ? null : presetProps
            .reduce((result, current, i) => ({...result, [publicProps[i]]: current}), {});
    }


    getPresetString(presetCode) {

        const props = this.getPresetProps(presetCode);

        if (!props) {
            return '';
        }

        return this._sizeProps()
            .map(prop => {
                const result = props[prop];
                delete props[prop];
                return result;
            })
            .join('x')
            + ' '
            + L['settings_field_bombs_count']
            + ': '
            + Object.values(props).toString();
    }
}

export default GameSettings;
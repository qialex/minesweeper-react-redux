// src/js/models/GameSettings.js
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
            _props: [8, 8, 10],
            code:  'beginner',
            L_key: 'settings_beginner',
        },
        {
            _props: [16, 16, 40],
            code:  'intermediate',
            L_key: 'settings_intermediate',
        },
        {
            _props: [16, 30, 99],
            code: 'expert',
            L_key: 'settings_expert',
        },
        {
            code: 'custom',
            L_key: 'settings_custom',
        }
    ]
};

ConstGameSettings.presets.map(preset => {
    Object.defineProperty(preset, 'props', {
        get: () => {
            return !preset._props ? null : preset._props
                .reduce((result, current, i) => ({...result, [ConstGameSettings.publicProps[i].code]: current}), {});
        }
    })
});

class GameSettings {

    _getMinMax(prop) {

        if (~(this._sizeProps.indexOf(prop))) {

            return {min: this._constants.minFieldSize, max: this._constants.maxFieldSize}
        } else {

            return {min: this._constants.minBombs, max: this._maxBombs}
        }
    }

    get _sizeProps() {

        return this._constants.sizeProps
            .map(index => this._constants.publicProps[index].code)
    }

    get _maxBombs() {

        return this._sizeProps
                .map(prop => this[prop])
                .reduce((p, current) => p * current, 1)
                - 1;
    }

    // accepting preset.code ( 'beginner' | 'intermediate' | 'expert' ) or object {x: 3, y: 5, bombs: 10}
    constructor(data) {

        this._constants = ConstGameSettings;

        this._initialData = data;

        if (!data || typeof data === 'string') {

            const preset = this.presets
                .filter(preset => preset.props)
                .find(preset => preset.code === data)
                || this._constants.presets[0];

            data = preset.props;
        }

        Object.keys(data)
            .filter(prop => this.publicProps.find(p => p.code === prop))
            .map(prop => this[prop] = data[prop]);


        this.minmax = {};

        this._constants.publicProps.map(prop => {

            Object.defineProperty(this.minmax, prop.code, {

                get: this._getMinMax.bind(this, prop.code)
            })
        });
    }

    get props() {

        // returning data
        return this.publicProps
            .reduce((result, prop) => ({...result, [prop.code]: this[prop.code]}), {});
    }

    get publicProps() {

        return this._constants.publicProps;
    }

    get presets() {

        return this._constants.presets;
    }

    get preset() {

        return this.presets.find(preset => {

                return this.publicProps
                    .map(prop => {

                        return preset.props && this[prop.code] === preset.props[prop.code]
                    })
                    .reduce((init, current) => init && current, true)
            })
            || this.presets[this.presets.length - 1];
    }

    get validation() {

        const props = this.props;

        return Object.keys(props)
            .map(prop => {

                const minmax = this.minmax[prop];

                if (!props[prop] || props[prop] < minmax.min || props[prop] > minmax.max) {

                    return {
                        prop: prop,
                        value: props[prop],
                        min: minmax.min,
                        max: minmax.max,
                    }
                }

                return null
            })
            .filter(_ => _);
    }
}


export default GameSettings;
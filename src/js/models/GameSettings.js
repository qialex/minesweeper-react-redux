// src/js/models/GameSettings.js


export const ConstGameSettings = {
    isQuestionTileEnabled: true,
    publicProps: [
        {
            code: 'x',
            L_key: 'settings_field_width',
            isSizeProp: true,
            isRowLength: true,
        },
        {
            code: 'y',
            L_key: 'settings_field_height',
            isSizeProp: true,
        },
        {
            code: 'bombs',
            L_key: 'settings_field_bombs_count',
        },
    ],
    minFieldSize: 3,
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
            _props: [30, 16, 99],
            code: 'expert',
            L_key: 'settings_expert',
        },
        {
            code: 'custom',
            L_key: 'settings_custom',
        }
    ],
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

        return this._constants.publicProps
            .filter(prop => prop.isSizeProp)
            .map(prop => prop.code)
    }

    get _maxBombs() {

        return this.tilesCount - 1;
    }

    // accepting preset.code ( 'beginner' | 'intermediate' | 'expert' ) or object {x: 3, y: 5, bombs: 10}
    constructor(data) {

        this._constants = ConstGameSettings;

        this._initialData = data;

        if (!data || typeof data === 'string' || typeof data !== 'object') {

            // trying to find data in presets, if not getting props from first preset
            const preset = this.presets
                .filter(preset => preset.props)
                .find(preset => preset.code === data)
                || this._constants.presets[0];

            data = preset.props;
        }

        // if data obj is invalid
        if (Object.keys(data).filter(prop => !this.publicProps.find(p => p.code === prop)).length) {

            // setting data from first preset
            data = this._constants.presets[0].props;
        }

        Object.keys(data)
            .filter(prop => this.publicProps.find(p => p.code === prop))
            .map(prop => this[`_${prop}`] = data[prop]);


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
            .reduce((result, prop) => ({...result, [prop.code]: this[`_${prop.code}`]}), {});
    }

    get publicProps() {

        return this._constants.publicProps;
    }

    get presets() {

        return this._constants.presets;
    }

    get isQuestionTileEnabled() {

        return this._constants.isQuestionTileEnabled;
    }

    get preset() {

        return this.presets.find(preset => {

                return this.publicProps
                    .map(prop => {

                        return preset.props && this[`_${prop.code}`] === preset.props[prop.code]
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

    get tilesCount() {

        return this._sizeProps
            .map(prop => this[`_${prop}`])
            .reduce((p, current) => p * current, 1)
    }

    get bombs() {

        return this.publicProps.filter(prop => !prop.isSizeProp)
            .map(prop => this[`_${prop.code}`])[0]
    }

    get rowLength() {

        return this.publicProps.filter(prop => prop.isRowLength)
            .map(prop => this[`_${prop.code}`])[0]
    }
}


export default GameSettings;

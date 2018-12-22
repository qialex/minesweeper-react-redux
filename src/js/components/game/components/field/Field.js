// src/js/components/Field.js
import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import { IN_GAME_USER_FIELD_ACTIONS } from '../../../../constants/in-game-user-field-actions';
import { processFieldAction } from "../../../../actions/index";
import './field.scss';
import GameSettings from "../../../../models/GameSettings";
import tileInitial from "../../../../constants/tile";


const MOUSE_DOWN_WHICH_TYPE = {
    LEFT_CLICK: 1,
    RIGHT_CLICK: 3,
};

const mapStateToProps = state => {

    return { game: {...state.game}, gameSettings: {...state.gameSettings} };
};

const mapDispatchToProps = dispatch => {

    return {
        processFieldAction: (tileIndex, userActionType) => dispatch(processFieldAction({tileIndex, userActionType})),
    };
};

class ConnectedField extends Component{

    constructor() {

        super();

        this.state = {
            which: 0,
            isMouseDown: false
        };

        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    handleContextMenu(event) {

        // preventing context menu
        event.preventDefault();
    }

    handleMouseDown(event) {

        const { which } = event.nativeEvent;

        // we want to hover tiles only on left mouse button mouse
        const isMouseDown = which === MOUSE_DOWN_WHICH_TYPE.LEFT_CLICK;

        // saving click, and which type of click (left/right button)
        this.setState({isMouseDown, which})
    }

    handleMouseUp(tileIndex) {

        const { which } = this.state;

        const userActionType = which === MOUSE_DOWN_WHICH_TYPE.LEFT_CLICK ? IN_GAME_USER_FIELD_ACTIONS.PRIMARY : IN_GAME_USER_FIELD_ACTIONS.SECONDARY;

        // process user action
        this.props.processFieldAction(tileIndex, userActionType);

        // unset mouse down effect
        this.setState({isMouseDown: false, which: undefined})
    }

    createField() {

        const { game, gameSettings } = this.props;

        // getting gameSettings
        const gameSettingsClass = new GameSettings(gameSettings);

        const rows = [];
        const tiles = [];

        // creating array of empty fields
        new Array(gameSettingsClass.tilesCount).fill(0).map((_, i) => {

            const tile = game.tiles && game.tiles.length && game.tiles[i];

            const classOpened = tile && tile.isOpened ? 'tile-opened' : '';
            const classBomb = tile && tile.isBomb && !tile.isFlag && game.finished ? 'tile-bomb' : '';

            const classFlag = tile && tile.isFlag ? 'tile-flag' : '';
            const fieldFlagWrong = tile && tile.isFlag && !tile.isBomb && game.finished ? 'tile-flag-wrong' : '';

            const classQuestion = tile && tile.isQestion && (!game.finished || !tile.isBomb) ? 'tile-question' : '';

            const fieldNumber = tile && tile.isOpened && tile.number || '';

            tiles.push(
                <div
                    data-number={fieldNumber}
                    key={('tile_' + i).toString()}
                    className={`tile ${classBomb} ${classOpened} ${classFlag} ${fieldFlagWrong} ${classQuestion} ${i}`}
                    onContextMenu={this.handleContextMenu}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp.bind(this, i)}>
                    {fieldNumber}
                </div>
            );

            if (!((i + 1) % gameSettingsClass.rowLength)) {

                rows.push(<div key={('row_' + i).toString()} className="row">{[...tiles]}</div>);

                tiles.length = 0;
            }
        });

        return rows;
    }

    render() {

        const { game } = this.props;
        const { isMouseDown } = this.state;

        const fieldClassList = 'field'
            + (game.started ? ' game-started' : '')
            + (game.finished ? ' game-finished' : '')
            + (isMouseDown && !game.finished ? ' mouse-downed' : '');

        return (
            <div className={fieldClassList}>
                {this.createField()}
            </div>
        )
    }
}
const Field = connect(mapStateToProps, mapDispatchToProps)(ConnectedField);
export default Field;
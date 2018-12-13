// src/js/components/Field.js
import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import { processLeftClick, processRightClick } from "../../actions/index";
import { getFieldByCoordinates } from '../../utils/utils';
import './field.scss';

const MOUSE_DOWN_WHICH_TYPE = {
    LEFT_CLICK: 1,
    RIGHT_CLICK: 3,
};

const mapStateToProps = state => {

    return { game: {...state.game}, gameSettings: {...state.gameSettings} };
};

const mapDispatchToProps = dispatch => {

    return {
        processLeftClick: (x, y) => dispatch(processLeftClick({x, y})),
        processRightClick: (x, y) => dispatch(processRightClick({x, y})),
    };
};

class ConnectedField extends Component{

    constructor() {

        super();

        this.state = {
            which: 0,
            isMouseDown: false
        };
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

    handleMouseUp(x, y) {

        const { which } = this.state;

        if ( which === MOUSE_DOWN_WHICH_TYPE.LEFT_CLICK ) {

            // process left mouse click
            this.props.processLeftClick(x, y);

        } else if ( which === MOUSE_DOWN_WHICH_TYPE.RIGHT_CLICK ) {

            // process right mouse click
            this.props.processRightClick(x, y);
        }

        this.setState({isMouseDown: false, which: undefined})
    }

    createField() {

        const { game, gameSettings } = this.props;

        let rows = [];

        // Outer loop to create parent
        for (let x = 0; x < gameSettings.x; x++) {
            let tiles = [];

            //Inner loop to create children
            for (let y = 0; y < gameSettings.y; y++) {

                const field = getFieldByCoordinates(game.fields, x, y);

                const classOpened = field && field.isOpened ? 'tile-opened' : '';
                const classBomb = field && field.isBomb && !field.isFlag && game.finished ? 'tile-bomb' : '';

                const classFlag = field && field.isFlag ? 'tile-flag' : '';
                const fieldFlagWrong = field && field.isFlag && !field.isBomb && game.finished ? 'tile-flag-wrong' : '';

                const classQuestion = field && field.isQestion && (!game.finished || !field.isBomb) ? 'tile-question' : '';

                const fieldNumber = field && field.isOpened && field.number || '';

                tiles.push(
                    <div
                        data-number={fieldNumber}
                        key={(x+y).toString()}
                        className={`tile ${classBomb} ${classOpened} ${classFlag} ${fieldFlagWrong} ${classQuestion} ${x + ' ' + y}`}
                        onContextMenu={this.handleContextMenu}
                        onMouseDown={this.handleMouseDown.bind(this)}
                        onMouseUp={this.handleMouseUp.bind(this, x, y)}>
                        {fieldNumber}
                    </div>
                )
            }

            //Create the parent and add the children
            rows.push(<div key={x.toString()} className="row">{tiles}</div>)
        }

        return rows
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
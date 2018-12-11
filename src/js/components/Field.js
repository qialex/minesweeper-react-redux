// src/js/components/Field.js
import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import { processLeftClick, processRightClick } from "../actions";
import { getFieldByCoordinates } from '../utils/utils';


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
    }

    handleClick(x, y) {

        // process left mouse click
        this.props.processLeftClick(x, y);
    }

    handleContextMenu(x, y, event) {

        // preventing context menu
        event.preventDefault();

        // process right mouse click
        this.props.processRightClick(x, y);
    }

    createField() {

        const { game, gameSettings } = this.props;

        let rows = [];

        // Outer loop to create parent
        for (let x = 0; x < gameSettings.x; x++) {
            let cell = [];

            //Inner loop to create children
            for (let y = 0; y < gameSettings.y; y++) {

                const field = getFieldByCoordinates(game.fields, x, y);

                const classBomb = field && field.isBomb ? 'field-bomb' : '';
                const classOpened = field && field.isOpened ? 'field-opened' : '';
                const classFlag = field && field.isFlag ? 'field-flag' : '';
                const fieldFlagWrong = field && field.isFlag && !field.isBomb && game.finished ? 'field-flag-wrong' : '';
                const classQuestion = field && field.isQestion ? 'field-question' : '';
                const fieldNumber = field && field.isOpened && field.number || '';

                cell.push(
                    <div
                        key={(x+y).toString()}
                        className={`cell ${classBomb} ${classOpened} ${classFlag} ${fieldFlagWrong} ${classQuestion} ${x + ' ' + y}`}
                        onClick={this.handleClick.bind(this, x, y)}
                        onContextMenu={this.handleContextMenu.bind(this, x, y)}>

                        {fieldNumber}
                    </div>
                )
            }

            //Create the parent and add the children
            rows.push(<div key={x.toString()} className="row">{cell}</div>)
        }

        return rows
    }

    render() {

        const { game } = this.props;

        return (
            <div className={'field' + (game.started ? ' game-started' : '') + (game.finished ? ' game-finished' : '')}>
                {this.createField()}
            </div>
        )
    }
}
const Field = connect(mapStateToProps, mapDispatchToProps)(ConnectedField);
export default Field;
// src/js/components/Field.js
import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import { processLeftClick, processRightClick } from "../../actions/index";
import { getFieldByCoordinates } from '../../utils/utils';
import './field.scss';


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
                        onClick={this.handleClick.bind(this, x, y)}
                        onContextMenu={this.handleContextMenu.bind(this, x, y)}>

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

        return (
            <div className={'field' + (game.started ? ' game-started' : '') + (game.finished ? ' game-finished' : '')}>
                {this.createField()}
            </div>
        )
    }
}
const Field = connect(mapStateToProps, mapDispatchToProps)(ConnectedField);
export default Field;
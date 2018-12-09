// src/js/components/Field.js
import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import { processLeftClick, processRightClick } from "../actions";
import '../../main.css';
const mapStateToProps = state => {
    return { game: {...state.game}, settings: {...state.settings} };
};
const mapDispatchToProps = dispatch => {
    return {
        processLeftClick: (x, y) => dispatch(processLeftClick({x, y})),
        processRightClick: (x, y) => dispatch(processRightClick({x, y})),
    };
};
class ConnectedField extends Component{

    constructor(){
        super();
        this.state = {
        };
    }

    componentDidMount(){
    }
    componentWillUnmount(){
    }
    getFieldBycoordinates(fields, x, y) {
        return fields && fields.length && fields.find(field => field.x === x && field.y === y);
    }
    handleClick(x, y) {
        this.props.processLeftClick(x, y);
    }
    handleContextMenu(x, y, event) {
        event.preventDefault();
        this.props.processRightClick(x, y);
    }
    createField() {

        const { game, settings } = this.props;

        let rows = [];

        // Outer loop to create parent
        for (let x = 0; x < settings.x; x++) {
            let cell = [];
            //Inner loop to create children
            for (let y = 0; y < settings.y; y++) {
                const field = this.getFieldBycoordinates(game.fields, x, y);
                // console.log (field)
                const classBomb = field && field.isBomb ? 'field-bomb' : '';
                const classOpened = field && field.isOpened ? 'field-opened' : '';
                const classFlag = field && field.isFlag ? 'field-flag' : '';
                const fieldFlagWrong = field && field.isFlag && !field.isBomb && game.finished ? 'field-flag-wrong' : '';
                const classQuestion = field && field.isQestion ? 'field-question' : '';
                const fieldNumber = field && field.isOpened && field.number || '';

                cell.push(<div className={`cell ${classBomb} ${classOpened} ${classFlag} ${fieldFlagWrong} ${classQuestion} ${x + ' ' + y}`} key={(x+y).toString()} onClick={this.handleClick.bind(this, x, y)} onContextMenu={this.handleContextMenu.bind(this, x, y)}>{fieldNumber}</div>)
            }
            //Create the parent and add the children
            rows.push(<div key={x.toString()} className="row">{cell}</div>)
        }
        return rows
    }
    render() {
        const { game, settings } = this.props;
        console.log ('render', game.started, game.finished);
        return (
            <div className={'field' + (game.started ? ' game-started' : '') + (game.finished ? ' game-finished' : '')}>
                {this.createField()}
            </div>
        )
    }
}
const Field = connect(mapStateToProps, mapDispatchToProps)(ConnectedField);
export default Field;
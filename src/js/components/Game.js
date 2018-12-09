// src/js/components/Game.js
import React, {Component} from "react";
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import {resetGame, updateGameTime} from "../actions";
import Field from "./Field";
import '../../main.css';


const mapStateToProps = state => {
    return { game: {...state.game}, settings: {...state.settings} };
};
const mapDispatchToProps = dispatch => {
    return {
        resetGame: () => dispatch(resetGame()),
        updateGameTime: time => dispatch(updateGameTime(time)),
    };
};
class ConnectedGame extends Component{

    constructor(){
        super();
        this.state = {
            timer: null,
        };
    }

    componentDidUpdate(prevProps) {
        // console.log (prevProps)
        // console.log (this.props);
        const { game } = this.props;
        if (!this.state.timer && game.started && !game.finished) {
            const timer = setInterval(this.tick.bind(this), 1000);
            this.setState({timer});
        }
        console.log (this.state.timer, (!game.started || game.finished));
        if (this.state.timer && (!game.started || game.finished)) {
            clearInterval(this.state.timer);
            this.setState({timer: null});
        }
    }

    tick() {
        const { game } = this.props;
        console.log (game.time)
        this.props.updateGameTime((game.time + 1) || 1);
    }

    handleNewGameClick() {
        this.props.resetGame();
    }

    render() {
        const { game, settings } = this.props;
        const bombsLeft = settings.bombs - game.flags;


        return (
            <div className="game">
                <div className="settings">
                    <Link to="/settings/">Settings</Link>
                </div>
                <div className="control-panel">
                    {bombsLeft}
                    <button type="submit" className="btn btn-success btn-lg" onClick={this.handleNewGameClick.bind(this)}>
                        New game
                    </button>

                    {game.time}
                </div>
                <div className="field-wrapper">
                    {game.won ? 'WON!' : ''}
                    <Field />
                </div>
            </div>
        )
    }
}
const Game = connect(mapStateToProps, mapDispatchToProps)(ConnectedGame);
export default Game;
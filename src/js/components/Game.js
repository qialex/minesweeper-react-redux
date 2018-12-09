// src/js/components/Game.js
import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import {resetGame, updateGameTime} from "../actions";
import Field from "./Field";
import Settings from "./Settings";
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
            isSettingsOpened: false
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
        // if (!game.started && this.state.isSettingsOpened) {
        //     this.handleSettingsClick()
        // }
    }

    tick() {
        const { game } = this.props;
        console.log (game.time)
        this.props.updateGameTime((game.time + 1) || 1);
    }

    handleNewGameClick() {
        this.props.resetGame();
    }
    handleSettingsClose() {
        this.setState({isSettingsOpened: false});
    }
    handleSettingsToggle() {
        this.setState({isSettingsOpened: !this.state.isSettingsOpened});
    }

    render() {
        const { isSettingsOpened } = this.state;
        const { game, settings } = this.props;
        const bombsLeft = settings.bombs - game.flags;


        return (
            <div className="game">
                <div className="settings">
                    <button type="submit" className="btn btn-success btn-lg" onClick={this.handleSettingsToggle.bind(this)}>
                        Settings
                    </button>
                    {isSettingsOpened ? <Settings handleSettingsSet={this.handleSettingsClose.bind(this)} /> : ''}
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
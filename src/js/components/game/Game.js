// src/js/components/Game.js
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { globalChangeLanguage, resetGame, updateGameTime } from "../../actions/index";
import Field from "./components/field/Field";
import L from "../../localization/Localization";
import './game.scss';


const mainButtonIconsNumbers = {
    positive: 5,
    negative: 6,
    promising: 2,
};

const mapStateToProps = state => {

    return { game: {...state.game}, gameSettings: {...state.gameSettings}, language: state.globalSettings.language };
};

const mapDispatchToProps = dispatch => {

    return {
        globalChangeLanguage: language => dispatch(globalChangeLanguage(language)),
        resetGame: () => dispatch(resetGame()),
        updateGameTime: time => dispatch(updateGameTime(time)),
    };
};

export class ConnectedGame extends Component {

    _reduxGlobalChangeLanguage(language) {

        // calling reducer function
        this.props.globalChangeLanguage(language);
    }

    _reduxUpdateGameTime(time) {

        // calling reducer function
        this.props.updateGameTime(time);
    }

    _reduxResetGame() {

        // reset game
        this.props.resetGame();
    }

    static getRandomIconNumber(type) {
        return 1 + ( Math.random() * mainButtonIconsNumbers[type] ) << 0
    }

    constructor(){

        super();

        this.state = {
            timer: null,
            isMouseDown: false
        };

        this.handleNewGameClick = this.handleNewGameClick.bind(this);
        this.handleGameMouseDown = this.handleGameMouseDown.bind(this);
        this.handleGameMouseUp = this.handleGameMouseUp.bind(this);
        this.tick = this.tick.bind(this);
    }

    componentWillMount() {

        // getting language from localStorage
        const localStorageLanguage = localStorage.getItem('language');
        if (localStorageLanguage) {

            // if exist setting as current interface language
            this._reduxGlobalChangeLanguage(localStorageLanguage);
        }
    }

    componentDidUpdate() {

        const { game } = this.props;

        // if game is started, but there is no timer
        if (!this.state.timer && game.started && !game.finished) {

            // starting timer
            const timer = setInterval(this.tick, 1000);

            // setting state
            this.setState({timer});

            return;
        }

        // if there is a timer, but game is not started or finished
        if (this.state.timer && (!game.started || game.finished)) {

            // clear interval
            clearInterval(this.state.timer);

            // setting state
            this.setState({timer: null});
        }
    }

    tick() {

        const { game } = this.props;

        // updating game time
        this._reduxUpdateGameTime(game.time + 1);
    }

    handleNewGameClick() {

        // reset game
        this._reduxResetGame();
    }

    handleGameMouseDown() {

        const { game } = this.props;

        if (!game.finished) {

            // setting state
            this.setState({isMouseDown: true});
        }
    }

    handleGameMouseUp() {

        const { game } = this.props;

        if (!game.finished) {

            // setting state
            this.setState({isMouseDown: false});
        }
    }

    render() {

        const { isMouseDown } = this.state;
        const { game, gameSettings } = this.props;
        const bombsLeft = gameSettings.bombs - game.flags;

        const mainButtonClass = 'main-button' +
            (
                game.won ? ` icon-positive-${ConnectedGame.getRandomIconNumber('positive')}`
                    : game.finished ? ` icon-negative-${ConnectedGame.getRandomIconNumber('negative')}`
                        : isMouseDown ? ` icon-promising-${ConnectedGame.getRandomIconNumber('promising')}`
                            : ''
            );

        return (
            <div className="main-wrapper">
                <div className="game">
                    <div className="control-panel">
                        <div className="settings">
                            <Link to="/settings/">{L.settings}</Link>
                        </div>
                        <div className="game-panel">
                            <div className="mines-left">
                                {bombsLeft}
                            </div>
                            <div className="main-button-wrapper">
                                <div className={mainButtonClass} onClick={this.handleNewGameClick}>
                                </div>
                            </div>
                            <div className="time-display">
                                {game.time}
                            </div>
                        </div>
                    </div>
                    <div className="field-wrapper" onMouseDown={this.handleGameMouseDown} onMouseUp={this.handleGameMouseUp}>
                        <Field />
                    </div>
                </div>
            </div>
        )
    }
}
const Game = connect(mapStateToProps, mapDispatchToProps)(ConnectedGame);
export default Game;
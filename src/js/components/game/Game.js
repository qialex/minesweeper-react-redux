// src/js/components/Game.js
import React, {Component} from "react";
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import {resetGame, updateGameTime} from "../../actions/index";
import Field from "../field/Field";
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
        resetGame: () => dispatch(resetGame()),
        updateGameTime: time => dispatch(updateGameTime(time)),
    };
};

class ConnectedGame extends Component{

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
    }

    componentWillMount() {

        // getting language from localStorage
        const localStorageLanguage = localStorage.getItem('language');
        if (localStorageLanguage) {

            // if exist setting as current interface language
            L.setLanguage(localStorageLanguage);
        }
    }

    componentDidUpdate() {

        const { game } = this.props;

        if (!this.state.timer && game.started && !game.finished) {
            const timer = setInterval(this.tick.bind(this), 1000);
            this.setState({timer});
        }

        if (this.state.timer && (!game.started || game.finished)) {
            clearInterval(this.state.timer);
            this.setState({timer: null});
        }
    }

    tick() {
        const { game } = this.props;

        // updating game time
        this.props.updateGameTime((game.time + 1) || 1);
    }

    handleNewGameClick() {

        // reset game
        this.props.resetGame();
    }

    handleGameMouseDown() {

        const { game } = this.props;

        if (!game.finished) {

            this.setState({isMouseDown: true});
        }
    }

    handleGameMouseUp() {

        const { game } = this.props;

        if (!game.finished) {

            this.setState({isMouseDown: false});
        }
    }

    render() {

        const { isMouseDown } = this.state;
        const { game, gameSettings } = this.props;
        const bombsLeft = gameSettings.bombs - game.flags;

        const mainButtonClass = game.won ? `icon-positive-${ConnectedGame.getRandomIconNumber('positive')}`
            : game.finished ? `icon-negative-${ConnectedGame.getRandomIconNumber('negative')}`
                : isMouseDown ? `icon-promising-${ConnectedGame.getRandomIconNumber('promising')}`
                    : '';

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
                            <div className="main-button">
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
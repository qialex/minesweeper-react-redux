// src/js/components/Game.js
import React, {Component} from "react";
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import {resetGame, updateGameTime} from "../../actions/index";
import Field from "../Field";
import L from "../../localization/Localization";
import './game.scss';


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

    constructor(){

        super();

        this.state = {
            timer: null,
        };
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

    render() {

        const { game, gameSettings } = this.props;
        const bombsLeft = gameSettings.bombs - game.flags;

        return (
            <div className="main-wrapper">
                <div className="game">
                    <div className="settings">
                        <Link to="/settings/">{L.settings}</Link>
                    </div>
                    <div className="control-panel">
                        <div className="mines-left">
                            {bombsLeft}
                        </div>
                        <div className="main-button">
                            <button type="submit" className={game.won ? 'game-won' : ''} onClick={this.handleNewGameClick.bind(this)}>
                            </button>
                        </div>
                        <div className="time-display">
                            {game.time}
                        </div>
                    </div>
                    <div className="field-wrapper">
                        <Field />
                    </div>
                </div>
            </div>
        )
    }
}
const Game = connect(mapStateToProps, mapDispatchToProps)(ConnectedGame);
export default Game;
// src/js/components/Timer.js
import connect from "react-redux/es/connect/connect";
import {resetGame, updateGameTime} from "../actions";
import React, {Component} from "react";
const mapStateToProps = state => {
    return { game: {...state.game}, settings: {...state.settings} };
};
const mapDispatchToProps = dispatch => {
    return {
        resetGame: () => dispatch(resetGame()),
        updateGameTime: time => dispatch(updateGameTime(time)),
    };
};
class ConnectedTimer extends Component {

    constructor(){
        super();
        this.state = {
            elapsed: 0
        };
    }

    componentDidMount() {

        // componentDidMount is called by react when the component
        // has been rendered on the page. We can set the interval here:

        this.timer = setInterval(this.tick.bind(this), 50);
    }

    componentWillUnmount() {

        // This method is called immediately before the component is removed
        // from the page and destroyed. We can clear the interval here:

        clearInterval(this.timer);
    }

    tick() {

        // This function is called every 50 ms. It updates the
        // elapsed counter. Calling setState causes the component to be re-rendered

        this.setState({elapsed: new Date() - this.props.start});
    }

    render() {
        console.log (this.props);

        // Calculate elapsed to tenth of a second:
        var elapsed = Math.round(this.state.elapsed / 100);

        // This will give a number with one digit after the decimal dot (xx.x):
        var seconds = (elapsed / 10).toFixed(1);

        // Although we return an entire <p> element, react will smartly update
        // only the changed parts, which contain the seconds variable.

        return seconds;
    }
}

const Timer = connect(mapStateToProps, mapDispatchToProps)(ConnectedTimer);
export default Timer;
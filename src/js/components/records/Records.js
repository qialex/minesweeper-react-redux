// src/js/components/Game.js
import React, { Component } from "react";
import { connect } from "react-redux";
import { resetGameRecords  } from "../../actions/index";
import './records.scss';
import L from "../../localization/Localization";
import GameRecords from "../../models/GameRecords";


const mapStateToProps = state => {

    return { gameRecordsSimple: state.gameRecordsSimple };
};

const mapDispatchToProps = dispatch => {

    return {
        resetGameRecords: () => dispatch(resetGameRecords()),
    };
};

export class ConnectedRecords extends Component {

    _dispatchResetGameRecords() {

        // dispatching reset gameRecords
        this.props.resetGameRecords();
    }

    _goToHomePage() {

        // redirect back to game
        this.props.onClose();
    }

    constructor(){

        super();

        this.state = {
            isResetGameRecords: false,
        };

        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
    }

    handleCloseClick() {

        // redirect back to game
        this._goToHomePage();
    }

    handleResetClick() {

        const { isResetGameRecords } = this.state;

        if (isResetGameRecords) {

            // resetting game records
            this._dispatchResetGameRecords();
        }

        // toggle isResetGameRecords
        this.setState({isResetGameRecords: !isResetGameRecords});
    }

    render() {

        const { isResetGameRecords } = this.state;

        const gameRecords = new GameRecords(this.props.gameRecordsSimple);

        const columns = {
            props: [],
            presets: [],
            records: [],
        };

        gameRecords.records.map((record, i) => {

            const props = record._props;

            columns.props.push(
                <div key={'props_' + i}>
                    <span className="no-capitalize"><b>{props[0]}</b>x<b>{props[1]}</b>, <b>{props[2]}</b></span>
                </div>
            );

            columns.presets.push(
                <div key={'presets_' + i}>
                    {L[record.preset.L_key]}
                </div>
            );

            columns.records.push(
                <div key={'records_' + i}>
                    {
                        record.isRecord ? (
                            record.time > 0 ?
                                <span className="record-time">{record.time} <span className="no-capitalize">{L.sec}</span></span>
                                : <span className="record-zero">{`<1`} <span className="no-capitalize">{L.sec}</span></span>
                        ) : (
                            <span className="record-no">{L.no_record}</span>
                        )
                    }
                </div>
            );
        });

        return (
            <div className="records-container">
                <div className="records-flex">
                    <div className="records-column">
                        {columns.props}
                    </div>
                    <div className="records-column">
                        {columns.presets}
                    </div>
                    <div className="records-column">
                        {columns.records}
                    </div>
                </div>
                <div className="buttons-group">
                    <button className="button-close" onClick={this.handleCloseClick}>
                        {L.close}
                    </button>
                    <button className="button-green" onClick={this.handleResetClick}>
                        {isResetGameRecords ? L.confirm_reset : L.reset}
                    </button>
                </div>
            </div>
        )
    }
}
const Records = connect(mapStateToProps, mapDispatchToProps)(ConnectedRecords);
export default Records;

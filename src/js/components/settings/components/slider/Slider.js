// src/js/components/settings/slider/Slider.js
import React, { Component } from "react";
import './slider.scss';

const addEventListenerOnceOptions = {once: true};

class Slider extends Component {

    _setCurrentValueFromProps() {

        // update currentValue by prop.value
        this.setState({currentValue: this.props.value})
    }

    _tryUpdateValue(value) {

        // if needed execute onValueChanged to update prop.value by value
        if (value !== this.props.value) {

            // sending new value to the parent Settings.js
            this.props.onValueChanged(value);
        }
    }

    _tryUpdateSliderLineWidth() {

        // width of the line element
        const sliderLineWidth = this.sliderLine.current && this.sliderLine.current.clientWidth;

        // checking if width changed
        if (sliderLineWidth && sliderLineWidth !== this.state.sliderLineWidth) {

            //setting line element width
            this.setState({sliderLineWidth: sliderLineWidth})
        }
    }

    _calculateShiftToValue(shift) {

        const { min, max, value } = this.props;
        const { sliderLineWidth } = this.state;

        // calculating mouse move distance to value
        return value + Math.round(shift / sliderLineWidth * (max - min));
    }

    _calculateCurrentValueToMargin() {
        const { min, max, value } = this.props;
        const { sliderLineWidth } = this.state;

        // calculating value to slider-dot margin
        return (value - min) / (max - min) * sliderLineWidth;
    }

    constructor() {

        super();

        this.state = {
            currentValue: 0,
            dragStartX: 0,
            shift: 0,
            sliderLineWidth: 0,
        };

        this.sliderLine = React.createRef();
        
        this.handleSliderLineClick   = this.handleSliderLineClick.bind(this);
        this.handleValueFieldChanged = this.handleValueFieldChanged.bind(this);
        this.handleMouseDownCapture  = this.handleMouseDownCapture.bind(this);
        this.handleMouseMove         = this.handleMouseMove.bind(this);
        this.handleMouseUp           = this.handleMouseUp.bind(this);
    }

    componentWillMount() {

        // initially set currentValue from prop.value
        this._setCurrentValueFromProps();
    }

    componentDidMount () {

        // setting up line element width
        this._tryUpdateSliderLineWidth();
    }

    componentDidUpdate(prevProps) {

        // if prop.value is changed changed
        if (prevProps.value !== this.props.value) {
            
            // update currentValue by prop.value
            this._setCurrentValueFromProps();
        }

        // checking if element width changed
        this._tryUpdateSliderLineWidth();
    }

    handleValueFieldChanged(event) {

        const { min, max } = this.props;
        let value = +event.target.value;

        // checking value for min and max
        value = value < min ? min : value;
        value = value > max ? max : value;

        // will update parent's value if needed
        this._tryUpdateValue(value)
    }

    handleSliderLineClick(event) {

        const { min, max } = this.props;

        // calculating value for clicked position
        const newCurrentValue =  Math.round((event.nativeEvent.offsetX ) / event.target.clientWidth * (max - min)) + min;

        // setting currentValue
        this.setState({currentValue: newCurrentValue});

        // will update parent's value if needed
        this._tryUpdateValue(newCurrentValue);
    }

    handleMouseDownCapture(event) {

        // adding event listeners
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp, addEventListenerOnceOptions);

        // ugly hack TODO: click! event on parent element firing after mouseDown event looks like a probable react bug
        document.querySelector('.setting-wrapper').addEventListener('click', (e) => {e.stopPropagation()}, addEventListenerOnceOptions);

        // saving X position of mouseDown event
        const { x } = event.nativeEvent;
        this.setState({dragStartX: x});
    }

    handleMouseMove(nativeEvent) {
        const x = nativeEvent.x;
        const { dragStartX, sliderLineWidth } = this.state;
        const { min, max } = this.props;

        // if mouse moved
        if (x && dragStartX) {

            // mouse distance in pixels
            let shift = x - dragStartX;

            // preventing placing .slider-dot out of .slider-line-wrapper
            const minShift = -this._calculateCurrentValueToMargin();
            const maxShift = sliderLineWidth + minShift;

            // newCurrentValue
            let newCurrentValue;

            if (shift < minShift){

                // set minShift as shift
                shift = minShift;

                // set newCurrentValue as max
                newCurrentValue = min;

            } else if (shift > maxShift){

                // set maxShift as shift
                shift = maxShift;

                // set newCurrentValue as min
                newCurrentValue = max;

            } else {

                // calculating new currentValue
                newCurrentValue = this._calculateShiftToValue(shift);
            }

            // setting new currentValue
            this.setState({currentValue: newCurrentValue, shift: shift});
        }
    }

    handleMouseUp() {

        // removing listener
        document.removeEventListener('mousemove', this.handleMouseMove);

        // cleaning event related data
        this.setState({dragStartX: 0, shift: 0});

        // will update parent's value if needed
        this._tryUpdateValue(this.state.currentValue);
    }

    render() {

        const { min, max } = this.props;
        const { currentValue, shift } = this.state;

        // calculating left margin for slider-dot
        const dotStyle = {
            marginLeft: `calc( ${this._calculateCurrentValueToMargin()}px + ${shift}px )`,
        };

        //
        const sliderLineActiveStyle = {
            width: dotStyle.marginLeft,
        };

        // input style to fit content
        const inputStyle = {
            width: `${currentValue.toString().length * 0.5 + 1.4}em`,
        };

        return (
            <div className="slider-wrapper">
                <div className="slider-min-max">{min}</div>
                <div ref={this.sliderLine} className="slider-line-wrapper" onClick={this.handleSliderLineClick}>
                    <div className="slider-line">
                        <div className="slider-line-active" style={sliderLineActiveStyle}>
                        </div>
                        <div className="slider-dot" style={dotStyle} onMouseDownCapture={this.handleMouseDownCapture}>
                        </div>
                    </div>
                </div>
                <div className="slider-min-max">{max}</div>
                <div className="slider-input-wrapper">
                    <input
                        className="slider-input"
                        type="number"
                        id="currentValue"
                        style={inputStyle}
                        value={currentValue}
                        onChange={this.handleValueFieldChanged}
                    />
                </div>
            </div>
        );
    }
}
export default Slider;
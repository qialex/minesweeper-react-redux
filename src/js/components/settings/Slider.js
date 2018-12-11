// src/js/components/settings/Slider.js
import React, { Component } from "react";
import '../../../slider.css';

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
        const sliderLineWidth = this.sliderLine.current.clientWidth;

        // checking if width changed
        if (sliderLineWidth !== this.state.sliderLineWidth) {

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
        
        this.handleSliderLineClick  = this.handleSliderLineClick.bind(this);
        this.handleValueFieldChange = this.handleValueFieldChange.bind(this);
        this.handleMouseDownCapture = this.handleMouseDownCapture.bind(this);
        this.handleMouseMove        = this.handleMouseMove.bind(this);
        this.handleMouseUp          = this.handleMouseUp.bind(this);
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

    handleValueFieldChange(event) {

        const { min, max } = this.props;
        let value = event.target.value;

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

        // if mouse moved
        if (x && dragStartX) {

            // mouse distance in pixels
            let shift = x - dragStartX;

            // preventing placing .slider-dot out of .slider-line
            const minShift = -this._calculateCurrentValueToMargin();
            const maxShift = sliderLineWidth + minShift;

            if (shift < minShift){
                shift = Math.floor(minShift);
            }
            if (shift > maxShift){
                shift = Math.floor(maxShift);
            }

            // calculating new currentValue
            const newCurrentValue = this._calculateShiftToValue(shift);

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

        return (
            <div className="slider-wrapper">
                <div>{min}</div>
                <div ref={this.sliderLine} className="slider-line" onClick={this.handleSliderLineClick}>
                    <div className="slider-dot" style={dotStyle} onMouseDownCapture={this.handleMouseDownCapture}>
                    </div>
                </div>
                <div>{max}</div>
                <div>
                    <input
                        className="slider-input"
                        type="number"
                        id="currentValue"
                        value={currentValue}
                        onChange={this.handleValueFieldChange}
                    />
                </div>
            </div>
        );
    }
}
export default Slider;
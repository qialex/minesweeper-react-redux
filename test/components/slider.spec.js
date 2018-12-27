// test/components/slider.spec.js
import React, {Component} from "react";
import sinon from 'sinon';
import { shallow } from '../enzyme';
import Slider from "../../src/js/components/settings/components/slider/Slider";


describe('Component: Slider',()=>{

    // setting spy on handleValueFieldChanged
    const handleValueFieldChangedSpy = sinon.spy(Slider.prototype, "handleValueFieldChanged");

    // setting spy on handleSliderLineClick
    const handleSliderLineClickSpy = sinon.spy(Slider.prototype, "handleSliderLineClick");

    // setting spy on handleMouseDownCapture
    const handleMouseDownCaptureSpy = sinon.spy(Slider.prototype, "handleMouseDownCapture");

    // setting spy on handleMouseMove
    const handleMouseMoveSpy = sinon.spy(Slider.prototype, "handleMouseMove");

    // setting spy on handleMouseUp
    const handleMouseUpSpy = sinon.spy(Slider.prototype, "handleMouseUp");

    // setting spy on onValueChanged
    const onValueChangedSpy = sinon.spy();

    // declaring wrapper, props
    let wrapper, min = 5, max = 20, value = 10;

    beforeEach(()=>{

        // wrapping Slider
        wrapper = shallow(<Slider
            min={min}
            max={max}
            value={value}
            onValueChanged={onValueChangedSpy} />);
    });

    it('renders the component', () => {
        // <div className="slider-wrapper">
        //     <div className="slider-min-max">{min}</div>
        //     <div ref={this.sliderLine} className="slider-line-wrapper" onClick={this.handleSliderLineClick}>
        //         <div className="slider-line">
        //             <div className="slider-line-active" style={sliderLineActiveStyle}>
        //             </div>
        //             <div className="slider-dot" style={dotStyle} onMouseDownCapture={this.handleMouseDownCapture}>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="slider-min-max">{max}</div>
        //     <div className="slider-input-wrapper">
        //         <input
        //             className="slider-input"
        //             type="number"
        //             id="currentValue"
        //             style={inputStyle}
        //             value={currentValue}
        //             onChange={this.handleValueFieldChanged}
        //         />
        //     </div>
        // </div>

        // should contain main div .slider-wrapper
        expect(wrapper.find('div.slider-wrapper')).toHaveLength(1);

        // should contain 2 .slider-min-max
        expect(wrapper.find('div.slider-min-max')).toHaveLength(2);

        // first should contain min hint
        expect(wrapper.find('div.slider-min-max').first().text()).toBe(min.toString());

        // first should contain max hint
        expect(wrapper.find('div.slider-min-max').last().text()).toBe(max.toString());

        // declaring sliderLine
        const sliderLine = wrapper.find('div.slider-line-wrapper').find(`div.slider-line`);

        // should contain main div .slider-wrapper
        expect(sliderLine).toHaveLength(1);

        // .sliderLine should contain one slider-line-active
        expect(sliderLine.find(`div.slider-line-active`)).toHaveLength(1);

        // and one .slider-dot
        expect(sliderLine.find(`div.slider-dot`)).toHaveLength(1);

        // should contain one input
        expect(wrapper.find('div.slider-input-wrapper').find(`input.slider-input`)).toHaveLength(1);

        // input value should be related to props
        expect(wrapper.find(`input.slider-input`).props().value).toBe(value);
    });
});

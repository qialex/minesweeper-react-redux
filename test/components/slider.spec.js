// test/components/slider.spec.js
import React from "react";
import sinon from 'sinon';
import { shallow } from '../enzyme';
import Slider from "../../src/js/components/settings/components/slider/Slider";


describe('Component: Slider',()=>{

    // setting spy on onValueChanged
    const onValueChangedSpy = sinon.spy();

    // declaring wrapper, props
    let wrapper, min = 5, max = 20, value = 10;

    beforeEach(()=>{

        // wrapping Slider
        wrapper = shallow(<Slider
            min={min}
            max={max}
            value={value - 1}
            onValueChanged={onValueChangedSpy} />);

        wrapper.instance().sliderLine = {
            current: {
                clientWidth: 1000,
            },
        };

        // updating props
        wrapper.setProps({value});
    });

    it('renders the component', () => {

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


    describe('handleValueFieldChanged', () => {

        // creating mock event
        const event = {
            target: { value: 'invalid_value' }
        };

        afterEach(() => {

            // resetting history of onValueChangedSpy
            onValueChangedSpy.resetHistory();
        });

        it('should not invoke onValueChanged if input value is invalid', () => {

            // simulating change event
            wrapper.find('input').simulate('change', event);

            // onValueChangedSpy should not be called once
            expect(onValueChangedSpy.notCalled).toBeTruthy();
        });

        it('should invoke onValueChanged and change value to max if input value > than max', () => {

            // updating mock event
            event.target.value = max + 1;

            // simulating change event
            wrapper.find('input').props().onChange(event);

            // onValueChangedSpy should be called once
            expect(onValueChangedSpy.calledOnce).toBeTruthy();

            // with max
            expect(onValueChangedSpy.calledWith(max)).toBeTruthy();
        });

        it('should invoke onValueChanged and change value to min if input value < than min', () => {

            // updating mock event
            event.target.value = min - 1;

            // simulating change event
            wrapper.find('input').props().onChange(event);

            // onValueChangedSpy should be called once
            expect(onValueChangedSpy.calledOnce).toBeTruthy();

            // with min
            expect(onValueChangedSpy.calledWith(min)).toBeTruthy();
        });

        it('should invoke onValueChanged and change value properly', () => {

            // updating mock event
            event.target.value = min + 1;

            // simulating change event
            wrapper.find('input').props().onChange(event);

            // onValueChangedSpy should be called once
            expect(onValueChangedSpy.calledOnce).toBeTruthy();

            // with event.target.value
            expect(onValueChangedSpy.calledWith(event.target.value)).toBeTruthy();
        });
    });

    describe('handleSliderLineClick', () => {

        afterEach(() => {

            // resetting history of onValueChangedSpy
            onValueChangedSpy.resetHistory();
        });

        it('should invoke onValueChanged if .slider-line-wrapper is clicked', () => {

            // creating mock event
            const event = {
                nativeEvent: { offsetX: 1, },
                target: { clientWidth: 1, }
            };

            // simulating change event
            wrapper.find('.slider-line-wrapper').simulate('click', event);

            // onValueChangedSpy should be called once
            expect(onValueChangedSpy.calledOnce).toBeTruthy();

            // with max
            expect(onValueChangedSpy.calledWith(max)).toBeTruthy();

            // state should be also updated
            expect(wrapper.state().currentValue).toBe(max)
        });
    });

    describe('drag .slider-dot', () => {

        afterEach(() => {

            // resetting history of onValueChangedSpy
            onValueChangedSpy.resetHistory();
        });

        it('handleMouseMove should change state.currentValue', () => {

            // creating mock event
            const eventMouseDown = {
                nativeEvent: { x: 5, },
            };

            // simulating eventMouseDown event
            wrapper.find('.slider-dot').props().onMouseDownCapture(eventMouseDown);

            // dragStartX should be eventMouseDown.nativeEvent.x
            expect(wrapper.state().dragStartX).toBe(eventMouseDown.nativeEvent.x);

            // shift should be 0
            expect(wrapper.state().shift).toBe(0);

            // creating mock event
            const mouseMove = new Event('mousemove');

            // simulating event without any action
            window.document.dispatchEvent(mouseMove);

            // value should not be changed
            expect(wrapper.state().currentValue).toBe(value);

            // moving mouse to the left
            mouseMove.x = -1000;

            // simulating mouseMove event
            window.document.dispatchEvent(mouseMove);

            // value should be equal to min
            expect(wrapper.state().currentValue).toBe(min);

            // shift should not be 0
            expect(wrapper.state().shift !== 0).toBeTruthy();

            // moving map back to center
            mouseMove.x = 500;

            // simulating mouseMove event
            window.document.dispatchEvent(mouseMove);

            // value should be more than min
            expect(wrapper.state().currentValue).toBeGreaterThan(min);

            // value should be less than max
            expect(wrapper.state().currentValue).toBeLessThan(max);

            // moving map to the right
            mouseMove.x = 1000;

            // simulating mouseMove event
            window.document.dispatchEvent(mouseMove);

            // value should be equal to the max
            expect(wrapper.state().currentValue).toBe(max);

            // state should be related to event
            //expect(wrapper.state()).toBe(123);

            // creating mouse up event
            const mouseUp = new Event('mouseup');

            // simulating mouseUp event
            window.document.dispatchEvent(mouseUp);

            // value should be equal to the max
            expect(wrapper.state().currentValue).toBe(max);

            // shift should be 0
            expect(wrapper.state().shift).toBe(0);

            // dragStartX should be 0
            expect(wrapper.state().dragStartX).toBe(0);
        });
    });
});

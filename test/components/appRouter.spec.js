import React from 'react';
import { shallow } from '../enzyme';
import Slider from "../../src/js/components/settings/components/slider/Slider";

describe('List tests', () => {

    it('renders list-items', () => {
        const min = 2;
        const max = 5;
        const value = 3;
        const onValueChanged = (newValue) => {
            console.log (newValue);
        };

        const wrapper = shallow(<Slider
            min={min}
            max={max}
            value={value}
            onValueChanged={onValueChanged} />);

        // Expect the wrapper object to be defined
        expect(wrapper).toBeDefined();
        expect(wrapper.find('.slider-wrapper')).toHaveLength(1);
    });
});
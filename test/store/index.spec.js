// test/store/index.js
import store from '../../src/js/store/index';
import stateInitial from '../../src/js/constants/state';


describe('store', () => {

    it('should be a valid store ', () => {

        // should be an instance of object
        expect(store instanceof Object).toBeTruthy();

        // should have dispatch method
        expect(store.dispatch).toBeDefined();

        // should have .getState equal to stateInitial
        expect(store.getState()).toEqual(stateInitial);
    });
});

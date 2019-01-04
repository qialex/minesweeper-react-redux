// test/components/appRouter.spec.js
import React from "react";
import { Route } from "react-router-dom";
import { shallow } from "enzyme/build";
import AppRouter from "../../src/js/components/AppRouter";
import Game  from "../../src/js/components/game/Game";
import Modal  from "../../src/js/components/modal/Modal";


describe('AppRouter', () => {

    it('renders correct routes', () => {

        // mapping routes
        shallow(<AppRouter />).find(Route).map(route => {

            // getting props
            const routeProps = route.props();

            if (routeProps.path === '/') {

                // '/' should be related to Game
                expect(routeProps.component).toBe(Game);
            }
            if (routeProps.path === '/modal') {

                // '/settings' should be related to Settings
                expect(routeProps.component).toBe(Modal);
            }
        });
    });
});

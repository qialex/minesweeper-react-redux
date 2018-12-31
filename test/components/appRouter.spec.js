// test/components/appRouter.spec.js
import React from "react";
import { Route } from "react-router-dom";
import { shallow } from "enzyme/build";
import AppRouter from "../../src/js/components/AppRouter";
import Game  from "../../src/js/components/game/Game";
import Settings  from "../../src/js/components/settings/Settings";

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
            if (routeProps.path === '/settings') {

                // '/settings' should be related to Settings
                expect(routeProps.component).toBe(Settings);
            }
        });
    });
});

// src/js/components/AppRouter.js
import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Game from "./game/Game";
import Settings from "./settings/Settings";
import '../../index.scss'

const AppRouter = () => (
    <HashRouter>
        <div>
            <Route path="/" component={Game} />
            <Route path="/settings/" component={Settings} />
        </div>
    </HashRouter>
);
export default AppRouter;
// src/js/components/AppRouter.js
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Game from "./game/Game";
import Settings from "./settings/Settings";

const AppRouter = () => (
    <BrowserRouter>
        <div>
            <Route path="/" component={Game} />
            <Route path="/settings/" component={Settings} />
        </div>
    </BrowserRouter>
);
export default AppRouter;
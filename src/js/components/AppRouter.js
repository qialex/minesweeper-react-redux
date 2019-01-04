// src/js/components/AppRouter.js
import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Game from "./game/Game";
import Modal from "./modal/Modal";
import '../../index.scss'


const AppRouter = () => (
    <HashRouter>
        <div>
            <Route path="/" component={Game} />
            <Route path="/modal/" component={Modal} />
        </div>
    </HashRouter>
);
export default AppRouter;

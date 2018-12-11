// src/js/components/AppRouter.js
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import App from "./App";
import Settings from "./settings/Settings";

const AppRouter = () => (
    <BrowserRouter>
        <div>
            <Route path="/" component={App} />
            <Route path="/settings/" component={Settings} />
        </div>
    </BrowserRouter>
);
export default AppRouter;
// src/js/index.js
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./store/index";
import AppRouter from "./components/AppRouter";

render(
    <Provider store={store}>
        <AppRouter />
    </Provider>,
    document.getElementById("app")
);

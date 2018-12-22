// src/js/store/index.js
import { createStore } from "redux";
import { rootReducer } from "../reducers/index";
const index = createStore(rootReducer);
export default index;
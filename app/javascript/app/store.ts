import createHistory from "history/createBrowserHistory";
import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./modules/reducers";

import { routerMiddleware } from "react-router-redux";
import savePlayedSeconds from "./middleware/savePlayedSeconds";
import syncQueryParams from "./middleware/syncQueryParams";

// Fix for redux-devtools-extension not supporting redux 4.0.0 yet
// tslint:disable-next-line:no-var-requires
const reduxModule = require("redux");
(reduxModule as any).__DO_NOT_USE__ActionTypes.INIT = "@@redux/INIT";
(reduxModule as any).__DO_NOT_USE__ActionTypes.REPLACE = "@@redux/REPLACE";

interface ReduxWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (a: object) => (b: object) => any;
}

const windowIfDefined =
  typeof window === "undefined" ? null : (window as ReduxWindow);

const composeEnhancers =
  windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

export const history = createHistory();

const historyMiddleware = routerMiddleware(history);

const enhancer = composeEnhancers(
  applyMiddleware(
    ...[thunkMiddleware, historyMiddleware, savePlayedSeconds, syncQueryParams]
  )
);

export const store = createStore(rootReducer, enhancer);

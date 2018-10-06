import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./modules/reducers";

import saveFavouriteEpisodes from "./middleware/saveFavouriteEpisodes";
import savePlayedSeconds from "./middleware/savePlayedSeconds";
import savePlayingEpisode from "./middleware/savePlayingEpisode";

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

export const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = composeEnhancers(
    applyMiddleware(
      ...[
        thunkMiddleware,
        savePlayedSeconds,
        savePlayingEpisode,
        saveFavouriteEpisodes,
        sagaMiddleware,
      ]
    )
  );
  const store = createStore(rootReducer, enhancer);

  if (process.env.NODE_ENV !== "production") {
    if (module.hot) {
      module.hot.accept("./modules/reducers", () => {
        store.replaceReducer(rootReducer);
      });
    }
  }

  return { store, runSaga: sagaMiddleware.run };
};

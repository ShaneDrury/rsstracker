import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./modules/reducers";

interface ReduxWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));
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

import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./modules/reducers";

import { composeWithDevTools } from "redux-devtools-extension";

export const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = composeWithDevTools(applyMiddleware(sagaMiddleware));
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

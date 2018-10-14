import "bulma/bulma";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { BrowserRouter, Route } from "react-router-dom";
import PrimaryContent from "./components/PrimaryContent";
import sagas from "./modules/sagas";
import { configureStore } from "./store";
import { init } from "./websocket";

const { store, runSaga } = configureStore();
init(store);
runSaga(sagas);

const render = (Component: any) => {
  return ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Route component={Component} />
      </BrowserRouter>
    </Provider>,
    document.getElementById("root")
  );
};

render(PrimaryContent);

if (module.hot) {
  module.hot.accept("./components/PrimaryContent", () => {
    render(PrimaryContent);
  });
}

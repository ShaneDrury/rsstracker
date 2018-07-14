import "babel-polyfill";
import "bulma/css/bulma.css";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { ConnectedRouter } from "react-router-redux";

import PrimaryContent from "./components/PrimaryContent";
import { configureStore, history } from "./store";
import { init } from "./websocket";

const store = configureStore();
init(store);

const render = (Component: any) => {
  return ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Component />
      </ConnectedRouter>
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

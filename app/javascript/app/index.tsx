import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { ConnectedRouter } from "react-router-redux";

import { PrimaryContent } from "./components/PrimaryContent";
import { history, store } from "./store";
import { init } from "./websocket";

init(store);

const root = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <PrimaryContent />
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(root, document.getElementById("root"));

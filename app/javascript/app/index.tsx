import "babel-polyfill";
import "bulma/bulma";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { BrowserRouter } from "react-router-dom";
import PrimaryContent from "./components/PrimaryContent";
import { configureStore } from "./store";
import { init } from "./websocket";

const store = configureStore();
init(store);

const render = (Component: any) => {
  return ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Component />
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

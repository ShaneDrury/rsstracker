import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { BrowserRouter, Route } from "react-router-dom";
import PrimaryContent from "./components/PrimaryContent";
import { fetchFeedsComplete } from "./modules/feeds/actions";
import { processFeed } from "./modules/feeds/sources";
import { getPreloaded } from "./modules/getInitialState";
import { fetchJobsComplete } from "./modules/jobs/actions";
import { processJobResponse } from "./modules/jobs/sources";
import sagas from "./modules/sagas";
import { configureStore } from "./store";
import { init } from "./websocket";

const { store, runSaga } = configureStore();
runSaga(sagas);
init(store);
const preloaded = getPreloaded();
store.dispatch(fetchFeedsComplete(preloaded.feeds.map(processFeed)));
store.dispatch(fetchJobsComplete(preloaded.jobs.map(processJobResponse)));

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

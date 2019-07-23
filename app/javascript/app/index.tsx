import * as Sentry from "@sentry/browser";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { Router, Route } from "react-router-dom";
import {
  EpisodeContainer,
  EpisodesContainer,
  FeedSelectContainer,
} from "./components/PrimaryContent";
import { fetchFeedsComplete } from "./modules/feeds/actions";
import { processFeed } from "./modules/feeds/sources";
import { getPreloaded } from "./modules/getInitialState";
import { fetchJobsComplete } from "./modules/jobs/actions";
import { processJobResponse } from "./modules/jobs/sources";
import sagas from "./modules/sagas";
import { configureStore } from "./store";
import { init } from "./websocket";
import { Navbar } from "./components/Navbar";
import Favourites from "./components/Favourites";
import { createBrowserHistory } from "history";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "http://d88d154936bc4afc924191fb2d4fee84@ubuntu.home:9001/1",
  });
}

const { store, runSaga } = configureStore();
runSaga(sagas);
init(store);
const history = createBrowserHistory();
const preloaded = getPreloaded();
store.dispatch(fetchFeedsComplete(preloaded.feeds.data.map(processFeed)));
store.dispatch(fetchJobsComplete(preloaded.jobs.data.map(processJobResponse)));

const rootWrap = (Component: React.ComponentType, el: HTMLElement | null) => {
  return ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Route component={Component} />
      </Router>
    </Provider>,
    el
  );
};

const renderRoots = () => {
  rootWrap(Navbar, document.getElementById("navbar"));
  rootWrap(FeedSelectContainer, document.getElementById("feed-select"));
  rootWrap(Favourites, document.getElementById("favourites"));
  rootWrap(EpisodesContainer, document.getElementById("content"));
  rootWrap(EpisodeContainer, document.getElementById("aside"));
};

renderRoots();

if (module.hot) {
  module.hot.accept("./components/PrimaryContent", () => {
    renderRoots();
  });
}

import React from "react";
import { Route } from "react-router";
import Feed from "./Feed";
import Feeds from "./Feeds";
import GlobalPlayer from "./GlobalPlayer";

export const PrimaryContent = () => (
  <div>
    <nav
      className="navbar is-fixed-top"
      role="navigation"
      aria-label="dropdown navigation"
    >
      <div className="navbar-start">
        <div className="navbar-item">Feed Tracker</div>
        <div className="navbar-item has-dropdown is-hoverable">
          <div className="navbar-link">Feeds</div>
          <Feeds />
        </div>
      </div>
      <div className="navbar-end">
        <div className="navbar-item is-right">
          <GlobalPlayer />
        </div>
      </div>
    </nav>
    <section className="section">
      <div className="columns">
        <div className="column">
          <Route path="/:feedId" component={Feed} />
        </div>
      </div>
    </section>
  </div>
);

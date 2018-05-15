import React from "react";
import { Route } from "react-router";
import ActiveJobs from "./ActiveJobs";
import Feed from "./Feed";
import Feeds from "./Feeds";
import GlobalPlayer from "./GlobalPlayer";
import UpdateFeeds from "./UpdateFeeds";

export const PrimaryContent: React.SFC = () => (
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
        <div className="navbar-item">
          <UpdateFeeds />
        </div>
        <div className="navbar-item">
          <ActiveJobs />
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

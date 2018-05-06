import React from "react";
import { Route } from "react-router";
import Feed from "./Feed";
import Feeds from "./Feeds";

export const PrimaryContent = () => (
  <section className="section">
    <div className="columns">
      <div className="column">
        <Route path="/:feedId" component={Feed} />
      </div>
      <div className="column is-one-fifth">
        <Feeds />
      </div>
    </div>
  </section>
);

import React from "react";
import { Route } from "react-router";
import { FeedContainer } from "./FeedContainer";
import { Feeds } from "./Feeds";

export const PrimaryContent = () => (
  <section className="section">
    <div className="columns">
      <div className="column is-one-quarter">
        <Feeds />
      </div>
      <div className="column">
        <Route path="/:feedId" component={FeedContainer} />
      </div>
    </div>
  </section>
);

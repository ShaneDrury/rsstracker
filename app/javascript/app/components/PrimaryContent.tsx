import React from "react";
import { Feeds } from "./Feeds";
import { FeedContainer } from "./FeedContainer";
import { Route } from "react-router";

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

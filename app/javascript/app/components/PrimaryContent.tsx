import React from "react";
import { Route } from "react-router";
import AllFeeds from "./AllFeeds";
import Feed from "./Feed";
import { Navbar } from "./Navbar";

class PrimaryContent extends React.PureComponent {
  public render() {
    return (
      <div>
        <Navbar />
        <section className="section">
          <div className="columns">
            <div className="column">
              <Route exact path="/" component={AllFeeds} />
              <Route path="/:feedId" component={Feed} />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default PrimaryContent;

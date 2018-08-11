import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import AllFeeds from "./AllFeeds";
import Feed from "./Feed";
import { Navbar } from "./Navbar";

class PrimaryContent extends React.PureComponent {
  public renderFeed = ({ match }: RouteComponentProps<{ feedId: string }>) => (
    <Feed feedId={match.params.feedId} />
  );

  public render() {
    return (
      <div>
        <Navbar />
        <section className="section">
          <div className="columns">
            <div className="column">
              <Route path="/:feedId" render={this.renderFeed} />
              <Route exact path="/" component={AllFeeds} />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default PrimaryContent;

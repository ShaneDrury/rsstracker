import { Location } from "history";
import * as qs from "qs";
import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { QueryParams } from "../modules/location/queryParams";
import AllFeeds from "./AllFeeds";
import Feed from "./Feed";
import { Navbar } from "./Navbar";

const parseLocation = (location: Location): QueryParams =>
  qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

class PrimaryContent extends React.Component {
  public renderFeed = ({
    location,
    match,
  }: RouteComponentProps<{ feedId: string }>) => (
    <Feed feedId={match.params.feedId} queryParams={parseLocation(location)} />
  );

  public renderAllFeeds = ({ location }: RouteComponentProps<{}>) => (
    <AllFeeds queryParams={parseLocation(location)} />
  );

  public render() {
    return (
      <div>
        <Navbar />
        <section className="section">
          <div className="columns">
            <div className="column">
              <Route exact path="/" render={this.renderAllFeeds} />
              <Route path="/:feedId" render={this.renderFeed} />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default PrimaryContent;

import { Location } from "history";
import * as qs from "qs";
import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { QueryParams } from "../modules/location/queryParams";
import AllFeedsSidePanel from "./AllFeedsSidePanel";
import FeedLoader from "./FeedLoader";
import FeedSidePanel from "./FeedSidePanel";
import FeedView from "./FeedView";
import { Navbar } from "./Navbar";

const parseLocation = (location: Location): QueryParams =>
  qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

class PrimaryContent extends React.Component {
  public renderFeed = ({
    location,
    match,
    history,
  }: RouteComponentProps<{ feedId: string }>) => (
    <FeedView
      sidePanel={
        <FeedLoader feedId={match.params.feedId}>
          {remoteFeed => (
            <FeedSidePanel
              history={history}
              queryParams={parseLocation(location)}
              remoteFeed={remoteFeed}
            />
          )}
        </FeedLoader>
      }
    />
  );

  public renderAllFeeds = ({ history, location }: RouteComponentProps<{}>) => (
    <FeedView
      sidePanel={
        <AllFeedsSidePanel
          history={history}
          queryParams={parseLocation(location)}
        />
      }
    />
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

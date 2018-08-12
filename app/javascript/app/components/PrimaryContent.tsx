import { Location } from "history";
import * as qs from "qs";
import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { QueryParams } from "../modules/location/queryParams";
import FeedLoader from "./FeedLoader";
import FeedView from "./FeedView";
import { Navbar } from "./Navbar";

import AllFeedsDetails from "./AllFeedsDetails";
import FeedDetails from "./FeedDetails";
import { FeedHeader } from "./FeedHeader";

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
    <FeedLoader feedId={match.params.feedId}>
      {remoteFeed => (
        <FeedView
          queryParams={parseLocation(location)}
          history={history}
          header={<FeedHeader remoteFeed={remoteFeed} />}
          details={
            <FeedDetails
              queryParams={parseLocation(location)}
              remoteFeed={remoteFeed}
            />
          }
          description={remoteFeed.description}
        />
      )}
    </FeedLoader>
  );

  public renderAllFeeds = ({ history, location }: RouteComponentProps<{}>) => (
    <FeedView
      header={<p className="card-header-title">All Feeds</p>}
      queryParams={parseLocation(location)}
      history={history}
      details={<AllFeedsDetails queryParams={parseLocation(location)} />}
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

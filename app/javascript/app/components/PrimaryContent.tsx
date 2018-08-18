import { Location } from "history";
import * as qs from "qs";
import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { QueryParams } from "../modules/location/queryParams";
import FeedLoader from "./FeedLoader";
import FeedView from "./FeedView";
import { Navbar } from "./Navbar";

import styled from "styled-components";
import AllFeedsDetails from "./AllFeedsDetails";
import AllFeedsLoader from "./AllFeedsLoader";
import FeedDetails from "./FeedDetails";
import FeedHeader from "./FeedHeader";

const parseLocation = (location: Location): QueryParams =>
  qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

const Section = styled.section`
  padding: 0px;
`;

class PrimaryContent extends React.Component {
  public renderFeed = ({
    location,
    match,
    history,
  }: RouteComponentProps<{ feedId: string }>) => (
    <FeedLoader
      queryParams={parseLocation(location)}
      feedId={match.params.feedId}
    >
      {remoteFeed => (
        <FeedView
          queryParams={parseLocation(location)}
          history={history}
          header={<FeedHeader remoteFeed={remoteFeed} />}
          details={<FeedDetails remoteFeed={remoteFeed} />}
          description={remoteFeed.description}
        />
      )}
    </FeedLoader>
  );

  public renderAllFeeds = ({ history, location }: RouteComponentProps<{}>) => (
    <AllFeedsLoader queryParams={parseLocation(location)}>
      <FeedView
        header={<p className="card-header-title">All Feeds</p>}
        queryParams={parseLocation(location)}
        history={history}
        details={<AllFeedsDetails />}
      />
    </AllFeedsLoader>
  );

  public renderNavbar = ({ history, location }: RouteComponentProps<{}>) => (
    <Navbar queryParams={parseLocation(location)} history={history} />
  );

  public render() {
    return (
      <div>
        <Route path="/" render={this.renderNavbar} />
        <Section className="section">
          <Route exact path="/" render={this.renderAllFeeds} />
          <Route path="/:feedId" render={this.renderFeed} />
        </Section>
      </div>
    );
  }
}

export default PrimaryContent;

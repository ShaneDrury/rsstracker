import { Location } from "history";
import * as qs from "qs";
import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { QueryParams } from "../modules/location/queryParams";
import { Navbar } from "./Navbar";

import styled from "styled-components";
import AllFeedsDetails from "./AllFeedsDetails";
import AllFeedsLoader from "./AllFeedsLoader";
import EpisodeDetail from "./EpisodeDetail";
import EpisodeLoader from "./EpisodeLoader";
import Episodes from "./Episodes";
import FeedDetails from "./FeedDetails";
import FeedHeader from "./FeedHeader";
import FeedSelect from "./FeedSelect";

const parseLocation = (location: Location): QueryParams =>
  qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

const Section = styled.section`
  padding: 0px;
`;

class PrimaryContent extends React.Component {
  public renderEpisodes = ({ history, location }: RouteComponentProps<{}>) => (
    <AllFeedsLoader queryParams={parseLocation(location)}>
      <Episodes queryParams={parseLocation(location)} history={history} />
    </AllFeedsLoader>
  );

  public renderNavbar = ({ history, location }: RouteComponentProps<{}>) => (
    <Navbar queryParams={parseLocation(location)} history={history} />
  );

  public renderEpisodeDetail = ({
    match,
    history,
    location,
  }: RouteComponentProps<{ episodeId: string }>) => (
    <AllFeedsLoader queryParams={parseLocation(location)}>
      <div className="columns is-paddingless">
        <div className="column is-one-half">
          <Episodes queryParams={parseLocation(location)} history={history} />
        </div>
        <div className="column is-one-half">
          <EpisodeLoader episodeId={match.params.episodeId}>
            {remoteEpisode => <EpisodeDetail episode={remoteEpisode} />}
          </EpisodeLoader>
        </div>
      </div>
    </AllFeedsLoader>
  );

  public render() {
    return (
      <div>
        <Route path="/" render={this.renderNavbar} />
        <Section className="section">
          <div className="columns">
            <div className="column is-one-quarter">
              <FeedSelect />
            </div>
            <div className="column is-three-quarters">
              <Route exact path="/" render={this.renderEpisodes} />
              <Route
                path="/episodeDetail/:episodeId"
                render={this.renderEpisodeDetail}
              />
            </div>
          </div>
        </Section>
      </div>
    );
  }
}

export default PrimaryContent;

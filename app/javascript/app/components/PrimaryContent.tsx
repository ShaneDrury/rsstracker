import { Location } from "history";
import * as qs from "qs";
import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { QueryParams } from "../modules/location/queryParams";
import { Navbar } from "./Navbar";

import { connect } from "react-redux";
import styled from "styled-components";
import { getDetailEpisodeId } from "../modules/episodes/selectors";
import { RootState } from "../modules/reducers";
import AllFeedsLoader from "./AllFeedsLoader";
import EpisodeDetail from "./EpisodeDetail";
import EpisodeLoader from "./EpisodeLoader";
import Episodes from "./Episodes";
import FeedSelect from "./FeedSelect";

const parseLocation = (location: Location): QueryParams =>
  qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

const Section = styled.section`
  padding: 0px;
`;

interface EnhancedProps {
  detailEpisodeId?: string;
}

type Props = EnhancedProps;

class PrimaryContent extends React.Component<Props> {
  public renderEpisodes = ({ history, location }: RouteComponentProps<{}>) => (
    <AllFeedsLoader queryParams={parseLocation(location)}>
      <div>
        {this.props.detailEpisodeId && (
          <div className="columns is-paddingless">
            <div className="column is-one-half">
              <Episodes
                queryParams={parseLocation(location)}
                history={history}
              />
            </div>
            <div className="column is-one-half">
              <EpisodeLoader episodeId={this.props.detailEpisodeId}>
                {remoteEpisode => <EpisodeDetail episode={remoteEpisode} />}
              </EpisodeLoader>
            </div>
          </div>
        )}
        {!this.props.detailEpisodeId && (
          <Episodes queryParams={parseLocation(location)} history={history} />
        )}
      </div>
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
            </div>
          </div>
        </Section>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => ({
  detailEpisodeId: getDetailEpisodeId(state),
});

export default connect(mapStateToProps)(PrimaryContent);

import { History } from "history";
import React from "react";
import { connect } from "react-redux";
import { Route, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import { getDetailEpisodeId } from "../modules/episodes/selectors";
import {
  parseLocation,
  QueryParams,
  syncQueryParams,
} from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import EpisodeDetail from "./EpisodeDetail";
import EpisodeLoader from "./EpisodeLoader";
import Episodes from "./Episodes";
import EpisodesLoader from "./EpisodesLoader";

const Scrollable = styled.div`
  height: 100%;
  overflow: auto;
`;

export const EpisodesContainer = () => {
  const handleChangePage = (queryParams: QueryParams, history: History) => (
    selected: number
  ) => {
    syncQueryParams({ currentPage: selected }, queryParams, history);
  };

  const renderRoot = ({
    history,
    location,
    match,
  }: RouteComponentProps<{ feedId?: string }>) => {
    const queryParams = parseLocation(location);
    return (
      <EpisodesLoader queryParams={queryParams} feedId={match.params.feedId}>
        <Scrollable>
          <Episodes handleChangePage={handleChangePage(queryParams, history)} />
        </Scrollable>
      </EpisodesLoader>
    );
  };
  return <Route path="/:feedId?" render={renderRoot} />;
};

interface Props {
  detailEpisodeId?: string;
}

export const Episode = ({ detailEpisodeId }: Props) => {
  if (detailEpisodeId) {
    return (
      <Scrollable>
        <EpisodeLoader episodeId={detailEpisodeId}>
          {remoteEpisode => <EpisodeDetail episode={remoteEpisode} />}
        </EpisodeLoader>
      </Scrollable>
    );
  }
  return null;
};

const mapStateToProps = (state: RootState): Props => ({
  detailEpisodeId: getDetailEpisodeId(state),
});

export const EpisodeContainer = connect(mapStateToProps)(Episode);

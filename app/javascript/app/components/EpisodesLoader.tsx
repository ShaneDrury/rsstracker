import React from "react";

import { connect } from "react-redux";
import { fetchEpisodesRequested } from "../modules/episodes/actions";
import { getFetchStatus } from "../modules/feeds/selectors";
import { SearchParams } from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";

import { getUpdatingSources } from "../modules/sourceJobs/selectors";

interface DataProps {
  children: JSX.Element;
  queryParams: SearchParams;
  feedId?: string;
}

interface EnhancedProps {
  fetchStatus: FetchStatus;
  loadingSources: string[];
}

interface DispatchProps {
  fetchEpisodes: (queryParams: SearchParams) => void;
}

type Props = DataProps & DispatchProps & EnhancedProps;

const EpisodesLoader: React.FunctionComponent<Props> = ({
  queryParams,
  feedId,
  fetchEpisodes,
  fetchStatus,
  loadingSources,
  children,
}) => {
  React.useEffect(() => {
    if (fetchStatus === "LOADING") {
      return;
    }
    if (feedId) {
      fetchEpisodes({
        ...queryParams,
        feedId,
      });
    } else {
      fetchEpisodes(queryParams);
    }
  }, [queryParams, feedId, loadingSources.length === 0]);
  return children;
};

const mapStateToProps = (state: RootState): EnhancedProps => {
  const fetchStatus = getFetchStatus(state);
  const loadingSources = getUpdatingSources(state);

  return {
    loadingSources,
    fetchStatus,
  };
};

const mapDispatchToProps = {
  fetchEpisodes: fetchEpisodesRequested,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EpisodesLoader);

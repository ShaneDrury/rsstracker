import React from "react";

import { connect } from "react-redux";
import { fetchEpisodesRequested } from "../modules/episodes/actions";
import { getFetchStatus } from "../modules/feeds/selectors";
import { SearchParams } from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";

import { getUpdatingFeeds } from "../modules/feedJobs/selectors";
import { usePrevious } from "../modules/hooks";

interface DataProps {
  children: JSX.Element;
  queryParams: SearchParams;
  feedId?: string;
}

interface EnhancedProps {
  fetchStatus: FetchStatus;
  loadingFeeds: string[];
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
  loadingFeeds,
  children,
}) => {
  const feedsLoading = loadingFeeds.length;
  const previousLoadingFeeds = usePrevious(loadingFeeds);
  const noLongerLoading =
    feedsLoading === 0 &&
    (previousLoadingFeeds ? previousLoadingFeeds.length > 0 : false);
  React.useEffect(() => {
    if (fetchStatus !== "LOADING" || noLongerLoading) {
      if (feedId) {
        fetchEpisodes({
          ...queryParams,
          feedId,
        });
      } else {
        fetchEpisodes(queryParams);
      }
    }
  }, [queryParams, feedId, fetchEpisodes, fetchStatus, noLongerLoading]);
  return children;
};

const mapStateToProps = (state: RootState): EnhancedProps => {
  const fetchStatus = getFetchStatus(state);
  const loadingFeeds = getUpdatingFeeds(state);

  return {
    loadingFeeds,
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

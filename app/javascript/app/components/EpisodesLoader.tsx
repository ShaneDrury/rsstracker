import React from "react";

import { connect } from "react-redux";
import { searchEpisodes } from "../modules/episodes/actions";
import { updateFeedAction } from "../modules/feedJobs/actions";
import { getFetchStatus } from "../modules/feeds/selectors";
import { SearchParams } from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";

import { isEqual } from "lodash";
import { getUpdatingFeeds } from "../modules/feedJobs/selectors";

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
  updateFeed: (feedId: string) => void;
}

type Props = DataProps & DispatchProps & EnhancedProps;

export class EpisodesLoader extends React.Component<Props> {
  public componentDidMount() {
    this.fetchEpisodes();
  }

  public shouldComponentUpdate(nextProps: Props) {
    return !isEqual(this.props, nextProps);
  }

  public componentDidUpdate(prevProps: Props) {
    if (
      !isEqual(this.props.queryParams, prevProps.queryParams) &&
      this.props.fetchStatus !== "LOADING"
    ) {
      this.fetchEpisodes();
    }
    if (this.props.feedId !== prevProps.feedId) {
      this.fetchEpisodes();
    }
    if (
      prevProps.loadingFeeds.length > 0 &&
      this.props.loadingFeeds.length === 0
    ) {
      this.fetchEpisodes();
    }
  }

  public fetchEpisodes = () => {
    if (this.props.feedId) {
      this.props.fetchEpisodes({
        ...this.props.queryParams,
        feedId: this.props.feedId,
      });
    } else {
      this.props.fetchEpisodes(this.props.queryParams);
    }
  };

  public render() {
    return this.props.children;
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => {
  const fetchStatus = getFetchStatus(state);
  const loadingFeeds = getUpdatingFeeds(state);

  return {
    loadingFeeds,
    fetchStatus,
  };
};

const mapDispatchToProps = {
  fetchEpisodes: searchEpisodes,
  updateFeed: updateFeedAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EpisodesLoader);

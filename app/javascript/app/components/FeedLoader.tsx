import { isEqual } from "lodash";
import React from "react";
import { RemoteFeed } from "../types/feed";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EpisodesAction, searchEpisodes } from "../modules/episodes/actions";
import { getFeedJobs } from "../modules/feedJobs/selectors";
import { fetchFeedAction } from "../modules/feeds/actions";
import { getFeedObjects } from "../modules/feeds/selectors";
import { SearchParams } from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import { Dispatch } from "../types/thunk";

interface DataProps {
  children: (remoteFeed: RemoteFeed) => JSX.Element;
}

interface EnhancedProps {
  isUpdating: boolean;
  remoteFeed?: RemoteFeed;
}

interface DispatchProps {
  fetchEpisodes: (queryParams: SearchParams) => void;
  onFeedStale: (feedId: string) => void;
}

interface PropsExtended {
  feedId: string;
  queryParams: SearchParams;
}

type Props = DataProps & DispatchProps & PropsExtended & EnhancedProps;

class FeedLoader extends React.Component<Props> {
  public componentDidMount() {
    this.fetchEpisodes();
  }

  public shouldComponentUpdate(nextProps: Props) {
    return !isEqual(this.props, nextProps);
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.remoteFeed && prevProps.remoteFeed) {
      if (this.props.remoteFeed.id !== prevProps.feedId) {
        this.fetchEpisodes();
      }
      if (!prevProps.remoteFeed.stale && this.props.remoteFeed.stale) {
        this.props.onFeedStale(this.props.remoteFeed.id);
      }
    }
    if (!isEqual(this.props.queryParams, prevProps.queryParams)) {
      this.fetchEpisodes();
    }
    if (prevProps.isUpdating && !this.props.isUpdating) {
      this.fetchEpisodes();
    }
  }

  public fetchEpisodes() {
    this.props.fetchEpisodes({
      ...this.props.queryParams,
      feedId: this.props.feedId,
    });
  }

  public render() {
    if (this.props.remoteFeed) {
      return this.props.children(this.props.remoteFeed);
    }
    return <div>LOADING</div>;
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: PropsExtended
): EnhancedProps => {
  const feedId = ownProps.feedId;
  const isUpdating = !!getFeedJobs(state)[feedId];
  const remoteFeed = getFeedObjects(state)[feedId];
  return {
    isUpdating,
    remoteFeed,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps => {
  return bindActionCreators(
    {
      fetchEpisodes: searchEpisodes,
      onFeedStale: fetchFeedAction,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedLoader);

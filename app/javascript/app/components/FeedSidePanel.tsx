import { History } from "history";
import React from "react";
import { RemoteFeed } from "../types/feed";

import { connect } from "react-redux";
import { getFeedObjects, getFetchStatus } from "../modules/feeds/selectors";
import { SearchParams } from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";
import LoadedFeedSidePanel from "./LoadedFeedSidePanel";

interface DataProps {
  history: History;
}

interface EnhancedProps {
  remoteFeed: RemoteFeed;
  fetchStatus: FetchStatus;
}

interface PropsExtended {
  feedId: string;
  queryParams: SearchParams;
}

type Props = DataProps & PropsExtended & EnhancedProps;

export class FeedSidePanel extends React.Component<Props> {
  public render() {
    if (this.props.remoteFeed && this.props.fetchStatus === "SUCCESS") {
      return (
        <LoadedFeedSidePanel
          history={this.props.history}
          queryParams={this.props.queryParams}
          feedId={this.props.feedId}
        />
      );
    }
    return <div>LOADING</div>;
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: PropsExtended
): EnhancedProps => {
  const feedId = ownProps.feedId;
  const remoteFeed = getFeedObjects(state)[feedId];
  const fetchStatus = getFetchStatus(state);
  return {
    remoteFeed,
    fetchStatus,
  };
};

export default connect(mapStateToProps)(FeedSidePanel);

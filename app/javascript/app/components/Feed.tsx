import React from "react";
import { RemoteFeed } from "../types/feed";

import { connect } from "react-redux";
import { getFeedObjects, getFetchStatus } from "../modules/feeds/selectors";
import { SearchParams } from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";
import LoadedFeed from "./LoadedFeed";

interface DataProps {
  remoteFeed?: RemoteFeed;
  fetchStatus: FetchStatus;
}

interface PropsExtended {
  feedId: string;
  queryParams: SearchParams;
}

type Props = DataProps & PropsExtended;

export class Feed extends React.Component<Props> {
  public render() {
    if (this.props.remoteFeed && this.props.fetchStatus === "SUCCESS") {
      return (
        <LoadedFeed
          feedId={this.props.remoteFeed.id}
          queryParams={this.props.queryParams}
        />
      );
    }
    return <div>LOADING</div>;
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: PropsExtended
): DataProps => {
  const feedId = ownProps.feedId;
  const remoteFeed = getFeedObjects(state)[feedId];
  const fetchStatus = getFetchStatus(state);
  return {
    remoteFeed,
    fetchStatus,
  };
};

export default connect(mapStateToProps)(Feed);

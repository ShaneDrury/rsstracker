import React from "react";
import { RemoteFeed } from "../types/feed";

import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { getFeedObjects, getFetchStatus } from "../modules/feeds/selectors";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";
import LoadedFeed from "./LoadedFeed";

interface DataProps {
  remoteFeed?: RemoteFeed;
  fetchStatus: FetchStatus;
}

interface PropsExtended extends RouteComponentProps<{ feedId: string }> {}

type Props = DataProps & PropsExtended;

export class Feed extends React.Component<Props> {
  public render() {
    if (this.props.remoteFeed && this.props.fetchStatus === "SUCCESS") {
      return <LoadedFeed feedId={this.props.remoteFeed.id} />;
    }
    return <div>LOADING</div>;
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: PropsExtended
): DataProps => {
  const feedId = ownProps.match.params.feedId;
  const remoteFeed = getFeedObjects(state)[feedId];
  const fetchStatus = getFetchStatus(state);
  return {
    remoteFeed,
    fetchStatus,
  };
};

export default connect(mapStateToProps)(Feed);

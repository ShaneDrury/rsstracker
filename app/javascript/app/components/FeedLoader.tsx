import React from "react";
import { RemoteFeed } from "../types/feed";

import { connect } from "react-redux";
import { getFeedObjects } from "../modules/feeds/selectors";
import { RootState } from "../modules/reducers";

interface DataProps {
  children: (remoteFeed: RemoteFeed) => JSX.Element;
}

interface EnhancedProps {
  remoteFeed: RemoteFeed;
}

interface PropsExtended {
  feedId: string;
}

type Props = DataProps & PropsExtended & EnhancedProps;

export class FeedLoader extends React.Component<Props> {
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
  const remoteFeed = getFeedObjects(state)[feedId];
  return {
    remoteFeed,
  };
};

export default connect(mapStateToProps)(FeedLoader);

import { History } from "history";
import React from "react";
import { SearchParams } from "../modules/location/queryParams";
import FeedSidePanel from "./FeedSidePanel";
import FeedView from "./FeedView";

interface DataProps {
  history: History;
  feedId: string;
  queryParams: SearchParams;
}

type Props = DataProps;

export class LoadedFeed extends React.Component<Props> {
  public render() {
    return (
      <FeedView
        sidePanel={
          <FeedSidePanel
            history={this.props.history}
            queryParams={this.props.queryParams}
            feedId={this.props.feedId}
          />
        }
      />
    );
  }
}

export default LoadedFeed;

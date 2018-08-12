import { History } from "history";
import React from "react";
import { SearchParams } from "../modules/location/queryParams";
import AllFeedsSidePanel from "./AllFeedsSidePanel";
import FeedView from "./FeedView";

interface DataProps {
  history: History;
  queryParams: SearchParams;
}

type Props = DataProps;

export class AllFeeds extends React.Component<Props> {
  public render() {
    return (
      <FeedView
        sidePanel={
          <AllFeedsSidePanel
            history={this.props.history}
            queryParams={this.props.queryParams}
          />
        }
      />
    );
  }
}

export default AllFeeds;

import { History } from "history";
import React from "react";
import { SearchParams } from "../modules/location/queryParams";
import Episodes from "./Episodes";
import FeedSidePanel from "./FeedSidePanel";

interface DataProps {
  history: History;
  feedId: string;
  queryParams: SearchParams;
}

type Props = DataProps;

export class LoadedFeed extends React.Component<Props> {
  public render() {
    return (
      <div className="columns">
        <div className="column is-one-quarter">
          <FeedSidePanel
            history={this.props.history}
            queryParams={this.props.queryParams}
            feedId={this.props.feedId}
          />
        </div>
        <div className="column">
          <Episodes />
        </div>
      </div>
    );
  }
}

export default LoadedFeed;

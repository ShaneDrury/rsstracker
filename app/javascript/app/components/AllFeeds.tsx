import { History } from "history";
import React from "react";
import { SearchParams } from "../modules/location/queryParams";
import AllFeedsSidePanel from "./AllFeedsSidePanel";
import Episodes from "./Episodes";

interface DataProps {
  history: History;
  queryParams: SearchParams;
}

type Props = DataProps;

export class AllFeeds extends React.Component<Props> {
  public render() {
    return (
      <div className="columns">
        <div className="column is-one-quarter">
          <AllFeedsSidePanel
            history={this.props.history}
            queryParams={this.props.queryParams}
          />
        </div>
        <div className="column">
          <Episodes />
        </div>
      </div>
    );
  }
}

export default AllFeeds;

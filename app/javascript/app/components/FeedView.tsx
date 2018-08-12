import { History } from "history";
import React from "react";
import { SearchParams } from "../modules/location/queryParams";
import Episodes from "./Episodes";
import Search from "./Search";
import StatusSelect from "./StatusSelect";

interface DataProps {
  queryParams: SearchParams;
  history: History;
  header: JSX.Element;
  details: JSX.Element;
  description?: string;
}

type Props = DataProps;

export class FeedView extends React.Component<Props> {
  public render() {
    return (
      <div className="columns">
        <div className="column is-one-quarter">
          <div className="card">
            {this.props.header}
            <div className="card-content">
              {this.props.details}
              <div className="field is-grouped">
                <div className="control">
                  <div className="select">
                    <StatusSelect
                      status={this.props.queryParams.status}
                      queryParams={this.props.queryParams}
                      history={this.props.history}
                    />
                  </div>
                </div>
                <div className="control is-expanded">
                  <Search
                    searchTerm={this.props.queryParams.searchTerm}
                    queryParams={this.props.queryParams}
                    history={this.props.history}
                  />
                </div>
              </div>
              <hr />
              {this.props.description && (
                <div className="content">{this.props.description}</div>
              )}
            </div>
          </div>
        </div>
        <div className="column">
          <Episodes />
        </div>
      </div>
    );
  }
}

export default FeedView;

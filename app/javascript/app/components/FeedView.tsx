import { History } from "history";
import React from "react";
import styled from "styled-components";
import { SearchParams, syncQueryParams } from "../modules/location/queryParams";
import { Status } from "../modules/status";
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

const Card = styled.div`
  height: 100%;
`;

export class FeedView extends React.PureComponent<Props> {
  public handleChangeStatus = (status: Status) => {
    syncQueryParams({ status }, this.props.queryParams, this.props.history);
  };

  public handleChangeSearch = (searchTerm: string) => {
    syncQueryParams({ searchTerm }, this.props.queryParams, this.props.history);
  };

  public handleChangePage = (currentPage: number) => {
    syncQueryParams(
      { currentPage },
      this.props.queryParams,
      this.props.history
    );
  };

  public render() {
    return (
      <div className="columns is-gapless">
        <div className="column is-one-quarter">
          <Card>
            {this.props.header}
            <div className="card-content">
              {this.props.details}
              <div className="field is-grouped">
                <div className="control">
                  <div className="select">
                    <StatusSelect
                      onChangeStatus={this.handleChangeStatus}
                      status={this.props.queryParams.status}
                    />
                  </div>
                </div>
                <div className="control is-expanded">
                  <Search
                    onChangeSearch={this.handleChangeSearch}
                    searchTerm={this.props.queryParams.searchTerm}
                  />
                </div>
              </div>
              <hr />
              {this.props.description && (
                <div className="content">{this.props.description}</div>
              )}
            </div>
          </Card>
        </div>
        <div className="column">
          <Episodes onPageChange={this.handleChangePage} />
        </div>
      </div>
    );
  }
}

export default FeedView;

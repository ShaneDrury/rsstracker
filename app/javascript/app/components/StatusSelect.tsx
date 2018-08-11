import React from "react";

import { connect } from "react-redux";
import { getAllStatusCounts } from "../modules/episodes/selectors";
import { QueryParams, syncQueryParams } from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import { Status } from "../modules/status";
import { StatusCounts } from "../types/feed";

interface DataProps {
  status?: Status;
  queryParams: QueryParams;
}

interface EnhancedProps {
  counts: StatusCounts;
}

interface DispatchProps {}

type Props = DataProps & EnhancedProps & DispatchProps;

interface OptionProps {
  value: Status;
  statusKey: string;
  label: string;
  count?: number;
}

class StatusSelectOption extends React.PureComponent<OptionProps> {
  public render() {
    return (
      <option
        value={this.props.value}
        key={`${this.props.statusKey}-${this.props.count || 0}`}
      >
        {this.props.label} {this.props.count && `(${this.props.count})`}
      </option>
    );
  }
}

export class StatusSelect extends React.PureComponent<Props> {
  public handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const status = event.target.value as Status;
    syncQueryParams({ status }, this.props.queryParams);
  };

  public render() {
    const counts = this.props.counts;

    return (
      <select
        className="select"
        onChange={this.handleFilterChange}
        value={this.props.status || "ALL"}
      >
        <option value="ALL" key={`all-${counts.all}`}>
          All ({counts.all})
        </option>
        <StatusSelectOption
          value={Status.SUCCESS}
          statusKey="success"
          label="Success"
          count={counts.success}
        />
        <StatusSelectOption
          value={Status.NOT_ASKED}
          statusKey="notAsked"
          label="Not asked"
          count={counts.notAsked}
        />
        <StatusSelectOption
          value={Status.LOADING}
          statusKey="loading"
          label="Loading"
          count={counts.loading}
        />
        <StatusSelectOption
          value={Status.FAILURE}
          statusKey="failure"
          label="Failure"
          count={counts.failure}
        />
      </select>
    );
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => {
  const counts = getAllStatusCounts(state);
  return {
    counts,
  };
};

export default connect(mapStateToProps)(StatusSelect);

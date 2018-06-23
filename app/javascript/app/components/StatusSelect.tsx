import React from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  changeFilterAction,
  EpisodesAction,
} from "../modules/episodes/actions";
import { Filter } from "../modules/filters";
import { getQueryParams } from "../modules/location/selectors";
import { RootState } from "../modules/reducers";
import { getAllStatusCounts } from "../modules/statusCounts/selectors";
import { StatusCounts } from "../types/feed";
import { Dispatch } from "../types/thunk";

interface EnhancedProps {
  filter: Filter;
  counts: StatusCounts;
}

interface DispatchProps {
  onChangeFilter: (filter: Filter) => void;
}

type Props = EnhancedProps & DispatchProps;

interface OptionProps {
  value: Filter;
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
    const filter = event.target.value as Filter;
    this.props.onChangeFilter(filter);
  };

  public render() {
    const counts = this.props.counts;

    return (
      <select
        className="select"
        onChange={this.handleFilterChange}
        value={this.props.filter}
      >
        <option value={Filter.ALL} key={`all-${counts.all}`}>
          All ({counts.all})
        </option>
        <StatusSelectOption
          value={Filter.SUCCESS}
          statusKey="success"
          label="Success"
          count={counts.success}
        />
        <StatusSelectOption
          value={Filter.NOT_ASKED}
          statusKey="notAsked"
          label="Not asked"
          count={counts.notAsked}
        />
        <StatusSelectOption
          value={Filter.LOADING}
          statusKey="loading"
          label="Loading"
          count={counts.loading}
        />
        <StatusSelectOption
          value={Filter.FAILURE}
          statusKey="failure"
          label="Failure"
          count={counts.failure}
        />
      </select>
    );
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => {
  const params = getQueryParams(state);
  const filterParam = params.filter;
  const filter: Filter = (filterParam as Filter) || Filter.ALL;
  const counts = getAllStatusCounts(state);

  return {
    filter,
    counts,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps => {
  return bindActionCreators(
    {
      onChangeFilter: changeFilterAction,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusSelect);

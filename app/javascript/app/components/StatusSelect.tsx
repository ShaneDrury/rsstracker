import React from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeFilter, EpisodesAction } from "../modules/episodes/actions";
import { getStatus } from "../modules/episodes/selectors";
import { Status } from "../modules/filters";
import { RootState } from "../modules/reducers";
import { getAllStatusCounts } from "../modules/statusCounts/selectors";
import { StatusCounts } from "../types/feed";
import { Dispatch } from "../types/thunk";

interface EnhancedProps {
  status: Status;
  counts: StatusCounts;
}

interface DispatchProps {
  onChangeFilter: (status: Status) => void;
}

type Props = EnhancedProps & DispatchProps;

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
    this.props.onChangeFilter(status);
  };

  public render() {
    const counts = this.props.counts;

    return (
      <select
        className="select"
        onChange={this.handleFilterChange}
        value={this.props.status}
      >
        <option value={Status.ALL} key={`all-${counts.all}`}>
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
  const status = getStatus(state);
  const counts = getAllStatusCounts(state);
  return {
    status,
    counts,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps => {
  return bindActionCreators(
    {
      onChangeFilter: changeFilter,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusSelect);

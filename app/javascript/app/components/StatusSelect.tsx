import * as qs from "qs";
import React from "react";

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import {
  changeFilterAction,
  EpisodesAction,
} from "../modules/episodes/actions";
import { getFeedObjects } from "../modules/feeds/selectors";
import { Filter } from "../modules/filters";
import { getLocation } from "../modules/location/selectors";
import { RootState } from "../modules/reducers";
import { StatusKey } from "../types/feed";

interface EnhancedProps {
  filter: Filter;
  counts: { [key in StatusKey]?: number };
}

interface DispatchProps {
  onChangeFilter: (filter: Filter) => void;
}

interface OwnProps {
  feedId: number;
}

type Props = EnhancedProps & DispatchProps;

export class StatusSelect extends React.PureComponent<Props> {
  public handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = event.target.value as Filter;
    this.props.onChangeFilter(filter);
  };

  public render() {
    const counts = this.props.counts;
    const countsWithDefault = ["all", "success", "notAsked", "failure"].reduce<{
      [key: string]: number;
    }>((acc, key) => {
      acc[key] = counts[key as StatusKey] || 0;
      return acc;
    }, {});
    return (
      <select
        className="select"
        onChange={this.handleFilterChange}
        value={this.props.filter}
      >
        <option value={Filter.ALL} key={`all-${countsWithDefault.all}`}>
          All {counts.all && `(${counts.all})`}
        </option>
        <option
          value={Filter.SUCCESS}
          key={`success-${countsWithDefault.success}`}
        >
          Success {counts.success && `(${counts.success})`}
        </option>
        <option
          value={Filter.NOT_ASKED}
          key={`notAsked-${countsWithDefault.notAsked}`}
        >
          Not asked {counts.notAsked && `(${counts.notAsked})`}
        </option>
        <option
          value={Filter.LOADING}
          key={`loading-${countsWithDefault.loading}`}
        >
          Loading {counts.loading && `(${counts.loading})`}
        </option>
        <option
          value={Filter.FAILURE}
          key={`failure-${countsWithDefault.failure}`}
        >
          Failure {counts.failure && `(${counts.failure})`}
        </option>
      </select>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: OwnProps
): EnhancedProps => {
  const location = getLocation(state);
  const params = location
    ? qs.parse(location.search, {
        ignoreQueryPrefix: true,
      })
    : {};
  const filterParam = params.filter;
  const filter: Filter = (filterParam as Filter) || Filter.ALL;
  const counts = getFeedObjects(state)[ownProps.feedId].statusCounts;

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

export default connect(mapStateToProps, mapDispatchToProps)(StatusSelect);

import * as qs from "qs";
import React from "react";

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { EpisodesAction, searchEpisodes } from "../modules/episodes/actions";
import { Filter } from "../modules/filters";
import { getLocation } from "../modules/location/selectors";
import { updateQueryParams } from "../modules/queryParams";
import { RootState } from "../modules/reducers";
import { history } from "../store";

interface EnhancedProps {
  filter: Filter;
  queryParams: string;
}

interface DispatchProps {
  onChangeFilter: () => void;
}

type Props = EnhancedProps & DispatchProps;
class StatusSelect extends React.PureComponent<Props> {
  public handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = event.target.value as Filter;
    const queryParams = updateQueryParams(this.props.queryParams, {
      filter,
    });
    history.push({ search: `?${queryParams}` });
    this.props.onChangeFilter();
  };

  public render() {
    return (
      <select
        className="select"
        onChange={this.handleFilterChange}
        value={this.props.filter}
      >
        <option value={Filter.ALL}>All</option>
        <option value={Filter.SUCCESS}>Success</option>
        <option value={Filter.NOT_ASKED}>Not asked</option>
        <option value={Filter.LOADING}>Loading</option>
        <option value={Filter.FAILURE}>Failure</option>
      </select>
    );
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => {
  const location = getLocation(state);
  const params = location
    ? qs.parse(location.search, {
        ignoreQueryPrefix: true,
      })
    : {};
  const filterParam = params.filter;
  const filter: Filter = (filterParam as Filter) || Filter.ALL;

  return {
    filter,
    queryParams: location ? location.search : "",
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps => {
  return bindActionCreators(
    {
      onChangeFilter: searchEpisodes,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusSelect);

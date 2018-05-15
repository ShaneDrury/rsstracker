import * as qs from "qs";

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { EpisodesAction, searchEpisodes } from "../modules/episodes/actions";
import { getAllStatusCounts } from "../modules/feeds/selectors";
import { Filter } from "../modules/filters";
import { getLocation } from "../modules/location/selectors";
import { RootState } from "../modules/reducers";
import { StatusKey } from "../types/feed";
import { StatusSelect } from "./StatusSelect";

interface EnhancedProps {
  filter: Filter;
  queryParams: string;
  counts: { [key in StatusKey]?: number };
}

interface DispatchProps {
  onChangeFilter: () => void;
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
  const counts = getAllStatusCounts(state);

  return {
    filter,
    counts,
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

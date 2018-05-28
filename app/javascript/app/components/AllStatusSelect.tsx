import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import {
  changeFilterAction,
  EpisodesAction,
} from "../modules/episodes/actions";
import { getAllStatusCounts } from "../modules/feeds/selectors";
import { Filter } from "../modules/filters";
import { getQueryParams } from "../modules/location/selectors";
import { RootState } from "../modules/reducers";
import { StatusKey } from "../types/feed";
import { StatusSelect } from "./StatusSelect";

interface EnhancedProps {
  filter: Filter;
  counts: { [key in StatusKey]?: number };
}

interface DispatchProps {
  onChangeFilter: (filter: Filter) => void;
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

export default connect(mapStateToProps, mapDispatchToProps)(StatusSelect);

import * as qs from "qs";
import React from "react";
import { connect } from "react-redux";
import { RootState } from "../modules/reducers";

import { DebounceInput } from "react-debounce-input";
import { bindActionCreators, Dispatch } from "redux";
import { EpisodesAction, searchEpisodes } from "../modules/episodes/actions";
import { getLocation } from "../modules/location/selectors";
import { updateQueryParams } from "../modules/queryParams";
import { history } from "../store";

interface DataProps {
  feedId: number;
}

interface EnhancedProps {
  searchTerm: string;
  queryParams: string;
}

interface DispatchProps {
  onChangeSearch: (feedId: number) => void;
}

type Props = DataProps & DispatchProps & EnhancedProps;

export class Search extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
  }

  public handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = event.target.value;
    const queryParams = updateQueryParams(this.props.queryParams, {
      searchTerm,
    });
    history.push({ search: `?${queryParams}` });
    this.props.onChangeSearch(this.props.feedId);
  }

  public render() {
    return (
      <DebounceInput
        minLength={1}
        debounceTimeout={300}
        type="text"
        className="input"
        placeholder="Search..."
        onChange={this.handleSearch}
        value={this.props.searchTerm}
      />
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
  const searchTerm = params.searchTerm || "";

  return {
    searchTerm,
    queryParams: location ? location.search : "",
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps =>
  bindActionCreators(
    {
      onChangeSearch: searchEpisodes,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Search);

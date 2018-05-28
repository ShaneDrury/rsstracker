import React from "react";
import { connect } from "react-redux";
import { RootState } from "../modules/reducers";

import { DebounceInput } from "react-debounce-input";
import { bindActionCreators, Dispatch } from "redux";
import {
  changeSearchAction,
  EpisodesAction,
} from "../modules/episodes/actions";
import { getQueryParams } from "../modules/location/selectors";

interface DataProps {}

interface EnhancedProps {
  searchTerm: string;
}

interface DispatchProps {
  onChangeSearch: (searchTerm: string) => void;
}

type Props = DataProps & DispatchProps & EnhancedProps;

export class Search extends React.PureComponent<Props> {
  public handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    this.props.onChangeSearch(searchTerm);
  };

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
  const params = getQueryParams(state);
  const searchTerm = params.searchTerm || "";

  return {
    searchTerm,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps =>
  bindActionCreators(
    {
      onChangeSearch: changeSearchAction,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Search);

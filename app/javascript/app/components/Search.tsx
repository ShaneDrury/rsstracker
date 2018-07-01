import React from "react";
import { connect } from "react-redux";
import { RootState } from "../modules/reducers";

import { DebounceInput } from "react-debounce-input";
import { bindActionCreators } from "redux";
import { changeSearch, EpisodesAction } from "../modules/episodes/actions";
import { getSearchTerm } from "../modules/episodes/selectors";
import { Dispatch } from "../types/thunk";

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

const mapStateToProps = (state: RootState): EnhancedProps => ({
  searchTerm: getSearchTerm(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps =>
  bindActionCreators(
    {
      onChangeSearch: changeSearch,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);

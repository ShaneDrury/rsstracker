import React from "react";

import { History } from "history";
import { DebounceInput } from "react-debounce-input";
import { QueryParams, syncQueryParams } from "../modules/location/queryParams";

interface DataProps {
  searchTerm?: string;
  queryParams: QueryParams;
  history: History;
}

interface DispatchProps {}

type Props = DataProps & DispatchProps;

export class Search extends React.PureComponent<Props> {
  public handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    syncQueryParams({ searchTerm }, this.props.queryParams, this.props.history);
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
        value={this.props.searchTerm || ""}
      />
    );
  }
}

export default Search;

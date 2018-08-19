import { History } from "history";
import React from "react";
import styled from "styled-components";
import { QueryParams, syncQueryParams } from "../modules/location/queryParams";
import ActiveJobs from "./ActiveJobs";
import GlobalPlayer from "./GlobalPlayer";
import Search from "./Search";

interface Props {
  queryParams: QueryParams;
  history: History;
}

const Nav = styled.div`
  display: flex;
  flex: 1;
  padding: 0.75rem;
`;

const PlayerWrapper = styled.div`
  flex: 5;
`;

const SearchWrapper = styled.div`
  flex: 1;
`;

export class Navbar extends React.PureComponent<Props> {
  public handleChangeSearch = (searchTerm: string) => {
    syncQueryParams({ searchTerm }, this.props.queryParams, this.props.history);
  };

  public render() {
    return (
      <Nav
        className="navbar has-background-light"
        role="navigation"
        aria-label="dropdown navigation"
      >
        <ActiveJobs />
        <PlayerWrapper>
          <GlobalPlayer />
        </PlayerWrapper>
        <SearchWrapper>
          <Search
            onChangeSearch={this.handleChangeSearch}
            searchTerm={this.props.queryParams.searchTerm}
          />
        </SearchWrapper>
      </Nav>
    );
  }
}

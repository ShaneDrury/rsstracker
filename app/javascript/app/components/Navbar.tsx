import React from "react";
import styled from "styled-components";
import ActiveJobs from "./ActiveJobs";
import GlobalPlayer from "./GlobalPlayer";

const Nav = styled.div`
  display: flex;
  padding: 0.75rem;
`;

export class Navbar extends React.PureComponent {
  public render() {
    return (
      <Nav
        className="navbar has-background-light"
        role="navigation"
        aria-label="dropdown navigation"
      >
        <ActiveJobs />
        <GlobalPlayer />
      </Nav>
    );
  }
}

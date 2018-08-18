import classNames from "classnames";
import { History } from "history";
import React from "react";
import { Link } from "react-router-dom";
import { QueryParams, syncQueryParams } from "../modules/location/queryParams";
import ActiveJobs from "./ActiveJobs";
import FeedSelect from "./FeedSelect";
import GlobalPlayer from "./GlobalPlayer";
import Search from "./Search";
import UpdateFeeds from "./UpdateFeeds";

interface Props {
  queryParams: QueryParams;
  history: History;
}

interface State {
  isOpen: boolean;
}

export class Navbar extends React.PureComponent<Props, State> {
  public state = {
    isOpen: false,
  };

  public handleToggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  public handleChangeSearch = (searchTerm: string) => {
    syncQueryParams({ searchTerm }, this.props.queryParams, this.props.history);
  };

  public render() {
    return (
      <nav
        className="navbar is-fixed-top has-background-light"
        role="navigation"
        aria-label="dropdown navigation"
      >
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            Feed Tracker
          </Link>
          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            onClick={this.handleToggleOpen}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>
        <div
          className={classNames("navbar-menu", {
            "is-active": this.state.isOpen,
          })}
        >
          <div className="navbar-start">
            <div className="navbar-item has-dropdown is-hoverable">
              <div className="navbar-link">Feeds</div>
              <FeedSelect />
            </div>
            <div className="navbar-item">
              <UpdateFeeds />
            </div>
            <div className="navbar-item">
              <ActiveJobs />
            </div>
          </div>
          <GlobalPlayer />
          <div className="navbar-end">
            <div className="navbar-item is-right">
              <Search
                onChangeSearch={this.handleChangeSearch}
                searchTerm={this.props.queryParams.searchTerm}
              />
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

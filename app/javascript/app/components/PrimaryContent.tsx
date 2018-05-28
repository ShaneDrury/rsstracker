import classNames from "classnames";
import React from "react";
import { Route } from "react-router";
import { Link } from "react-router-dom";
import ActiveJobs from "./ActiveJobs";
import AllFeeds from "./AllFeeds";
import Feed from "./Feed";
import Feeds from "./Feeds";
import GlobalPlayer from "./GlobalPlayer";
import UpdateFeeds from "./UpdateFeeds";

interface Props {}

interface State {
  isOpen: boolean;
}

export class PrimaryContent extends React.PureComponent<Props, State> {
  public state = {
    isOpen: false,
  };

  public handleToggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  public render() {
    return (
      <div>
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
                <Feeds />
              </div>
              <div className="navbar-item">
                <UpdateFeeds />
              </div>
              <div className="navbar-item">
                <ActiveJobs />
              </div>
            </div>
            <div className="navbar-end">
              <div className="navbar-item is-right is-paddingless">
                <GlobalPlayer />
              </div>
            </div>
          </div>
        </nav>
        <section className="section">
          <div className="columns">
            <div className="column">
              <Route exact path="/" component={AllFeeds} />
              <Route path="/:feedId" component={Feed} />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

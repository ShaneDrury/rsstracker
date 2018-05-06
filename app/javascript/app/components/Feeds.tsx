import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import { FeedsAction, fetchFeeds } from "../modules/feeds/actions";
import { getFeedsList, getFetchStatus } from "../modules/feeds/selectors";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";
import { RemoteFeed } from "../types/feed";

interface DataProps {
  remoteFeeds: RemoteFeed[];
  fetchStatus: FetchStatus;
}

interface DispatchProps {
  fetchFeeds: () => void;
}

type Props = DataProps & DispatchProps;

export class Feeds extends React.PureComponent<Props> {
  public componentDidMount() {
    this.props.fetchFeeds();
  }

  public render() {
    return (
      <aside className="menu">
        <p className="menu-label">Feeds</p>
        {this.props.fetchStatus === "SUCCESS" &&
          this.props.remoteFeeds.length === 0 && <div>No results.</div>}
        {this.props.fetchStatus === "LOADING" && <div>Loading...</div>}
        <ul className="menu-list">
          {this.props.remoteFeeds.map(remoteFeed => (
            <li key={remoteFeed.key}>
              <Link to={`/${remoteFeed.id}`}>{remoteFeed.name}</Link>
            </li>
          ))}
        </ul>
      </aside>
    );
  }
}

const mapStateToProps = (state: RootState): DataProps => {
  const remoteFeeds = getFeedsList(state);
  const fetchStatus = getFetchStatus(state);
  return {
    remoteFeeds,
    fetchStatus,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<FeedsAction, RootState>
): DispatchProps =>
  bindActionCreators(
    {
      fetchFeeds,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Feeds);

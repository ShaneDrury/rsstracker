import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { FeedsAction, fetchFeedsAction } from "../modules/feeds/actions";
import { getFeeds, getFetchStatus } from "../modules/feeds/selectors";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";
import { RemoteFeed } from "../types/feed";
import { Dispatch } from "../types/thunk";

interface DataProps {
  remoteFeeds: RemoteFeed[];
  fetchStatus: FetchStatus;
}

interface DispatchProps {
  fetchFeeds: () => void;
}

type Props = DataProps & DispatchProps;

export class FeedSelect extends React.PureComponent<Props> {
  public componentDidMount() {
    this.props.fetchFeeds();
  }

  public render() {
    return (
      <div className="navbar-dropdown">
        {this.props.fetchStatus === "SUCCESS" &&
          this.props.remoteFeeds.length === 0 && <div>No results.</div>}
        {this.props.remoteFeeds.map(remoteFeed => (
          <Link
            className="navbar-item"
            key={remoteFeed.key}
            to={`/${remoteFeed.id}`}
          >
            {remoteFeed.name}
          </Link>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): DataProps => {
  const remoteFeeds = getFeeds(state);
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
      fetchFeeds: fetchFeedsAction,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedSelect);

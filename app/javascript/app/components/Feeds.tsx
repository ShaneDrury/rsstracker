import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import * as shortid from "shortid";
import { FeedsAction, fetchFeeds } from "../modules/feeds/actions";
import { getFeeds } from "../modules/feeds/selectors";
import { RootState } from "../modules/reducers";
import { RemoteData } from "../modules/remoteData";
import { RemoteFeed } from "../types/feed";

type RemoteDataWithKey<D> = RemoteData<D> & {
  key: string;
};

interface DataProps {
  remoteFeeds: Array<RemoteDataWithKey<RemoteFeed>>;
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
      <div className="container">
        {this.props.remoteFeeds.length === 0 && <div>No results</div>}
        <ul>
          {this.props.remoteFeeds.map(remoteFeed => (
            <li key={remoteFeed.key}>
              {remoteFeed.type === "SUCCESS" && (
                <Link to={`/${remoteFeed.data.id}`}>
                  {remoteFeed.data.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): DataProps => {
  const feeds = Object.values(getFeeds(state));
  return {
    remoteFeeds: feeds.map(feed => ({ ...feed, key: shortid.generate() }))
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<FeedsAction, RootState>
): DispatchProps =>
  bindActionCreators(
    {
      fetchFeeds
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Feeds);

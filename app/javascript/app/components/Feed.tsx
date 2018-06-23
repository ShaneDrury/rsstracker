import React from "react";
import { RemoteFeed } from "../types/feed";

import { faSync } from "@fortawesome/fontawesome-free-solid";
import * as moment from "moment";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bindActionCreators } from "redux";
import { EpisodesAction, searchEpisodes } from "../modules/episodes/actions";
import { getFeedJobs } from "../modules/feedJobs/selectors";
import { updateFeedAction } from "../modules/feeds/actions";
import { getFeedObjects, getFetchStatus } from "../modules/feeds/selectors";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";
import { Dispatch } from "../types/thunk";
import Episodes from "./Episodes";
import { Icon } from "./Icon";
import Search from "./Search";
import StatusSelect from "./StatusSelect";

interface DataProps {
  isUpdating: boolean;
  remoteFeed: RemoteFeed;
  fetchStatus: FetchStatus;
  feedId: number;
}

interface DispatchProps {
  fetchEpisodes: () => void;
  updateFeed: (feedId: number) => void;
}

interface PropsExtended extends RouteComponentProps<{ feedId: number }> {}

type Props = DataProps & DispatchProps & PropsExtended;

export class Feed extends React.PureComponent<Props> {
  public componentDidMount() {
    this.props.fetchEpisodes();
  }

  public componentDidUpdate(prevProps: Props) {
    if (
      prevProps.feedId !== this.props.feedId ||
      prevProps.location.key !== this.props.location.key ||
      (prevProps.remoteFeed &&
        prevProps.remoteFeed.key !== this.props.remoteFeed.key)
    ) {
      this.props.fetchEpisodes();
    }
  }

  public handleUpdateFeed = () => {
    this.props.updateFeed(this.props.remoteFeed.id);
  };

  public render() {
    if (this.props.remoteFeed && this.props.fetchStatus === "SUCCESS") {
      const {
        name,
        description,
        relativeImageLink,
        updatedAt,
        url,
      } = this.props.remoteFeed;
      return (
        <div className="columns">
          <div className="column is-one-quarter">
            <div className="card">
              <header className="card-header">
                <p className="card-header-title">
                  <a href={url}>{name}</a>
                </p>
              </header>
              <div className="card-image">
                <figure className="image is-1by1">
                  <img src={relativeImageLink} />
                </figure>
              </div>
              <div className="card-content">
                <div className="field">
                  <div className="control">
                    <button
                      className="button is-primary"
                      onClick={this.handleUpdateFeed}
                      disabled={this.props.isUpdating}
                    >
                      <Icon icon={faSync} spin={this.props.isUpdating} />&nbsp;Update
                    </button>
                  </div>
                </div>
                <div className="field">
                  Updated at: <time>{moment(updatedAt).format("lll")}</time>
                </div>
                <div className="field is-grouped">
                  <div className="control">
                    <div className="select">
                      <StatusSelect />
                    </div>
                  </div>
                  <div className="control is-expanded">
                    <Search />
                  </div>
                </div>
                <hr />
                <div className="content">{description}</div>
              </div>
            </div>
          </div>
          <div className="column">
            <Episodes />
          </div>
        </div>
      );
    }
    return <div>LOADING</div>;
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: PropsExtended
): DataProps => {
  const feedId = ownProps.match.params.feedId;
  const remoteFeed = getFeedObjects(state)[feedId];
  const fetchStatus = getFetchStatus(state);
  const isUpdating = !!getFeedJobs(state)[feedId];
  return {
    isUpdating,
    remoteFeed,
    feedId,
    fetchStatus,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps => {
  return bindActionCreators(
    {
      fetchEpisodes: searchEpisodes,
      updateFeed: updateFeedAction,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feed);

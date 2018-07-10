import React from "react";
import { RemoteFeed } from "../types/feed";

import { faSync } from "@fortawesome/fontawesome-free-solid";
import { isEqual } from "lodash";
import * as moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EpisodesAction, searchEpisodes } from "../modules/episodes/actions";
import { getQueryParams } from "../modules/episodes/selectors";
import { updateFeedAction } from "../modules/feedJobs/actions";
import { getFeedJobs } from "../modules/feedJobs/selectors";
import {
  fetchFeedAction,
  setFeedAutodownload,
  setFeedDisabled,
} from "../modules/feeds/actions";
import { getFeedObjects, getFetchStatus } from "../modules/feeds/selectors";
import { QueryParams } from "../modules/location/queryParams";
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
  queryParams: QueryParams;
  shouldUpdate: boolean;
}

interface DispatchProps {
  fetchEpisodes: (queryParams: QueryParams) => void;
  onUpdateFinished: (queryParams: QueryParams) => void;
  updateFeed: (feedId: number) => void;
  onFeedStale: (feedId: string) => void;
  setFeedDisabled: (feedId: number, disabled: boolean) => void;
  setFeedAutodownload: (feedId: number, autodownload: boolean) => void;
}

interface PropsExtended {
  feedId: number;
}

type Props = DataProps & DispatchProps & PropsExtended;

export class Feed extends React.Component<Props> {
  public componentDidMount() {
    this.props.fetchEpisodes(this.props.queryParams);
  }

  public shouldComponentUpdate(nextProps: Props) {
    return !isEqual(this.props, nextProps);
  }

  public componentDidUpdate(prevProps: Props) {
    if (
      !isEqual(this.props.queryParams, prevProps.queryParams) &&
      this.props.fetchStatus !== "LOADING"
    ) {
      this.props.fetchEpisodes(this.props.queryParams);
    }
    if (prevProps.isUpdating && !this.props.isUpdating) {
      this.props.onUpdateFinished(this.props.queryParams);
    }
    if (!prevProps.shouldUpdate && this.props.shouldUpdate) {
      this.props.onFeedStale(this.props.remoteFeed.id.toString());
    }
  }

  public handleUpdateFeed = () => {
    this.props.updateFeed(this.props.remoteFeed.id);
  };

  public handleToggleDisableFeed = () => {
    this.props.setFeedDisabled(
      this.props.remoteFeed.id,
      !this.props.remoteFeed.disabled
    );
  };

  public handleToggleAutodownload = () => {
    this.props.setFeedAutodownload(
      this.props.remoteFeed.id,
      !this.props.remoteFeed.autodownload
    );
  };

  public render() {
    const {
      autodownload,
      name,
      disabled,
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
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={!disabled}
                  onChange={this.handleToggleDisableFeed}
                />{" "}
                Enabled
              </label>{" "}
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={autodownload}
                  onChange={this.handleToggleAutodownload}
                />{" "}
                Auto-download
              </label>
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
}

const mapStateToProps = (
  state: RootState,
  ownProps: PropsExtended
): DataProps => {
  const feedId = ownProps.feedId;
  const remoteFeed = getFeedObjects(state)[feedId];
  const fetchStatus = getFetchStatus(state);
  const isUpdating = !!getFeedJobs(state)[feedId];
  const shouldUpdate = remoteFeed.stale;
  return {
    isUpdating,
    remoteFeed,
    fetchStatus,
    queryParams: getQueryParams(state),
    shouldUpdate,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps => {
  return bindActionCreators(
    {
      fetchEpisodes: searchEpisodes,
      updateFeed: updateFeedAction,
      onFeedStale: fetchFeedAction,
      onUpdateFinished: searchEpisodes,
      setFeedDisabled,
      setFeedAutodownload,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feed);

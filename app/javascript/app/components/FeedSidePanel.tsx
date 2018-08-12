import { History } from "history";
import React from "react";
import { RemoteFeed } from "../types/feed";

import { faSync } from "@fortawesome/fontawesome-free-solid";
import { isEqual } from "lodash";
import * as moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EpisodesAction, searchEpisodes } from "../modules/episodes/actions";
import { updateFeedAction } from "../modules/feedJobs/actions";
import { getFeedJobs } from "../modules/feedJobs/selectors";
import {
  fetchFeedAction,
  setFeedAutodownload,
  setFeedDisabled,
} from "../modules/feeds/actions";
import { getFeedObjects } from "../modules/feeds/selectors";
import { SearchParams } from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import { Dispatch } from "../types/thunk";
import { Icon } from "./Icon";
import Search from "./Search";
import StatusSelect from "./StatusSelect";

interface DataProps {
  history: History;
}

interface EnhancedProps {
  isUpdating: boolean;
  remoteFeed: RemoteFeed;
  shouldUpdate: boolean;
}

interface DispatchProps {
  fetchEpisodes: (queryParams: SearchParams) => void;
  updateFeed: (feedId: string) => void;
  onFeedStale: (feedId: string) => void;
  setFeedDisabled: (feedId: string, disabled: boolean) => void;
  setFeedAutodownload: (feedId: string, autodownload: boolean) => void;
}

interface PropsExtended {
  feedId: string;
  queryParams: SearchParams;
}

type Props = DataProps & DispatchProps & PropsExtended & EnhancedProps;

export class FeedSidePanel extends React.Component<Props> {
  public componentDidMount() {
    this.fetchEpisodes();
  }

  public shouldComponentUpdate(nextProps: Props) {
    return !isEqual(this.props, nextProps);
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.feedId !== prevProps.feedId) {
      this.fetchEpisodes();
    }
    if (!isEqual(this.props.queryParams, prevProps.queryParams)) {
      this.fetchEpisodes();
    }
    if (prevProps.isUpdating && !this.props.isUpdating) {
      this.fetchEpisodes();
    }
    if (!prevProps.shouldUpdate && this.props.shouldUpdate) {
      this.props.onFeedStale(this.props.remoteFeed.id);
    }
  }

  public fetchEpisodes() {
    this.props.fetchEpisodes({
      ...this.props.queryParams,
      feedId: this.props.feedId,
    });
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
                <Icon icon={faSync} spin={this.props.isUpdating} />
                &nbsp;Update
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
                <StatusSelect
                  status={this.props.queryParams.status}
                  queryParams={this.props.queryParams}
                  history={this.props.history}
                />
              </div>
            </div>
            <div className="control is-expanded">
              <Search
                searchTerm={this.props.queryParams.searchTerm}
                queryParams={this.props.queryParams}
                history={this.props.history}
              />
            </div>
          </div>
          <hr />
          <div className="content">{description}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: PropsExtended
): EnhancedProps => {
  const feedId = ownProps.feedId;
  const remoteFeed = getFeedObjects(state)[feedId];
  const isUpdating = !!getFeedJobs(state)[feedId];
  const shouldUpdate = remoteFeed.stale;
  return {
    isUpdating,
    remoteFeed,
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
      setFeedDisabled,
      setFeedAutodownload,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedSidePanel);

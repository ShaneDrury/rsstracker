import { faSync } from "@fortawesome/fontawesome-free-solid";
import React from "react";
import { RemoteFeed } from "../types/feed";

import * as moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EpisodesAction } from "../modules/episodes/actions";
import { updateFeedAction } from "../modules/feedJobs/actions";
import { getFeedJobs } from "../modules/feedJobs/selectors";
import { setFeedAutodownload, setFeedDisabled } from "../modules/feeds/actions";
import { RootState } from "../modules/reducers";
import { Dispatch } from "../types/thunk";
import { Icon } from "./Icon";

interface EnhancedProps {
  isUpdating: boolean;
}

interface DispatchProps {
  updateFeed: (feedId: string) => void;
  setFeedDisabled: (feedId: string, disabled: boolean) => void;
  setFeedAutodownload: (feedId: string, autodownload: boolean) => void;
}

interface PropsExtended {
  remoteFeed: RemoteFeed;
}

type Props = DispatchProps & PropsExtended & EnhancedProps;

class FeedDetails extends React.Component<Props> {
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
    const { remoteFeed } = this.props;
    return (
      <React.Fragment>
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
            checked={!remoteFeed.disabled}
            onChange={this.handleToggleDisableFeed}
          />{" "}
          Enabled
        </label>{" "}
        <label className="checkbox">
          <input
            type="checkbox"
            checked={remoteFeed.autodownload}
            onChange={this.handleToggleAutodownload}
          />{" "}
          Auto-download
        </label>
        <div className="field">
          Updated at: <time>{moment(remoteFeed.updatedAt).format("lll")}</time>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: PropsExtended
): EnhancedProps => {
  const feedId = ownProps.remoteFeed.id;
  const isUpdating = !!getFeedJobs(state)[feedId];
  return {
    isUpdating,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps => {
  return bindActionCreators(
    {
      updateFeed: updateFeedAction,
      setFeedDisabled,
      setFeedAutodownload,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedDetails);

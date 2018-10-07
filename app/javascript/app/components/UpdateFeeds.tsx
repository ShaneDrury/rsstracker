import { faSync } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React from "react";
import { connect } from "react-redux";
import { updateFeedsRequested } from "../modules/feedJobs/actions";
import { getUpdatingFeeds } from "../modules/feedJobs/selectors";
import { getEnabledFeedIds } from "../modules/feeds/selectors";
import { RootState } from "../modules/reducers";
import { Icon } from "./Icon";

interface DataProps {
  className: string;
}

interface EnhancedProps {
  feedIds: string[];
  updating: boolean;
}

interface DispatchProps {
  updateFeeds: (feedIds: string[]) => void;
}

type Props = DataProps & DispatchProps & EnhancedProps;

export class UpdateFeeds extends React.PureComponent<Props> {
  public handleUpdateFeeds = () => {
    return this.props.updateFeeds(this.props.feedIds);
  };

  public render() {
    return (
      <button
        className={classNames("button is-primary", this.props.className)}
        onClick={this.handleUpdateFeeds}
        disabled={this.props.updating}
      >
        <span className="icon">
          <Icon icon={faSync} spin={this.props.updating} />
        </span>
        <span>Update all</span>
      </button>
    );
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => {
  const updating = getUpdatingFeeds(state).length > 0;
  return {
    feedIds: getEnabledFeedIds(state),
    updating,
  };
};

const mapDispatchToProps = {
  updateFeeds: updateFeedsRequested,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateFeeds);

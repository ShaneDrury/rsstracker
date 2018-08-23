import { faSync } from "@fortawesome/fontawesome-free-solid";
import React from "react";
import { connect } from "react-redux";
import { updateFeedsAction } from "../modules/feedJobs/actions";
import { getEnabledFeedIds } from "../modules/feeds/selectors";
import { RootState } from "../modules/reducers";
import { Icon } from "./Icon";

interface EnhancedProps {
  feedIds: string[];
}

interface DispatchProps {
  updateFeeds: (feedIds: string[]) => void;
}

type Props = DispatchProps & EnhancedProps;

export class UpdateFeeds extends React.PureComponent<Props> {
  public handleUpdateFeeds = () => {
    return this.props.updateFeeds(this.props.feedIds);
  };

  public render() {
    return (
      <button className="button is-primary" onClick={this.handleUpdateFeeds}>
        <span className="icon">
          <Icon icon={faSync} />
        </span>
        <span>Update all</span>
      </button>
    );
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => ({
  feedIds: getEnabledFeedIds(state),
});

const mapDispatchToProps = {
  updateFeeds: updateFeedsAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateFeeds);

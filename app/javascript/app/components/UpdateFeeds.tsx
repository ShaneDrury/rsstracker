import { faSync } from "@fortawesome/fontawesome-free-solid";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EpisodesAction } from "../modules/episodes/actions";
import { updateFeedsAction } from "../modules/feeds/actions";
import { getSortedFeedIds } from "../modules/feeds/selectors";
import { RootState } from "../modules/reducers";
import { Dispatch } from "../types/thunk";
import { Icon } from "./Icon";

interface EnhancedProps {
  feedIds: number[];
}

interface DispatchProps {
  updateFeeds: (feedIds: number[]) => void;
}

type Props = DispatchProps & EnhancedProps;

export class UpdateFeeds extends React.PureComponent<Props> {
  public handleUpdateFeeds = () => {
    return this.props.updateFeeds(this.props.feedIds);
  };

  public render() {
    return (
      <button className="button is-primary" onClick={this.handleUpdateFeeds}>
        <Icon icon={faSync} />&nbsp;Update all
      </button>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  feedIds: getSortedFeedIds(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps => {
  return bindActionCreators(
    {
      updateFeeds: updateFeedsAction,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateFeeds);

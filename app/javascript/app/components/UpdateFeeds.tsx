import { faSync } from "@fortawesome/fontawesome-free-solid";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { EpisodesAction } from "../modules/episodes/actions";
import { updateFeedsAction } from "../modules/feeds/actions";
import { RootState } from "../modules/reducers";
import { Icon } from "./Icon";

interface DispatchProps {
  updateFeeds: () => void;
}

type Props = DispatchProps;

export class UpdateFeeds extends React.PureComponent<Props> {
  public handleUpdateFeeds = () => {
    return this.props.updateFeeds();
  };

  public render() {
    return (
      <button className="button is-primary" onClick={this.handleUpdateFeeds}>
        <Icon icon={faSync} />&nbsp;Update all
      </button>
    );
  }
}

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

export default connect(undefined, mapDispatchToProps)(UpdateFeeds);

import { faSync } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React from "react";
import { connect } from "react-redux";
import { updateFeedsRequested } from "../modules/feedJobs/actions";
import { RootState } from "../modules/reducers";
import { getUpdatingSources } from "../modules/sourceJobs/selectors";
import { Icon } from "./Icon";

interface DataProps {
  className: string;
}

interface EnhancedProps {
  updating: boolean;
}

interface DispatchProps {
  updateFeeds: () => void;
}

type Props = DataProps & DispatchProps & EnhancedProps;

export class UpdateFeeds extends React.PureComponent<Props> {
  public handleUpdateFeeds = () => {
    return this.props.updateFeeds();
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
  const updating = getUpdatingSources(state).length > 0;
  return {
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

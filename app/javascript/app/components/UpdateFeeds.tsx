import { faSync } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React from "react";
import { connect } from "react-redux";
import { updateFeedsRequested } from "../modules/feedJobs/actions";
import { RootState } from "../modules/reducers";
import { getUpdatingFeeds } from "../modules/feedJobs/selectors";
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

const UpdateFeeds: React.FunctionComponent<Props> = ({
  updateFeeds,
  className,
  updating,
}) => {
  const handleUpdateFeeds = () => {
    return updateFeeds();
  };

  return (
    <button
      className={classNames("button is-primary", className)}
      onClick={handleUpdateFeeds}
      disabled={updating}
    >
      <span className="icon">
        <Icon icon={faSync} spin={updating} />
      </span>
      <span>Update all</span>
    </button>
  );
};

const mapStateToProps = (state: RootState): EnhancedProps => {
  const updating = getUpdatingFeeds(state).length > 0;
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

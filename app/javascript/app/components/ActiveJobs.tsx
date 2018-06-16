import { difference } from "lodash";
import React from "react";
import Notification from "react-bulma-notification";
import "react-bulma-notification/build/css/index.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchJobs, JobsAction } from "../modules/jobs/actions";
import { getJobs } from "../modules/jobs/selectors";
import { RootState } from "../modules/reducers";
import { RemoteJob } from "../types/job";
import { Dispatch } from "../types/thunk";

interface EnhancedProps {
  jobs: RemoteJob[];
}

interface DispatchProps {
  getJobs: () => void;
}

type Props = EnhancedProps & DispatchProps;

interface State {
  keys: string[];
}

export class ActiveJobs extends React.PureComponent<Props, State> {
  public state: State = {
    keys: [],
  };

  public componentDidMount() {
    this.props.getJobs();
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.jobs !== this.props.jobs) {
      const keysToRemove = difference(
        prevState.keys,
        this.props.jobs.map(job => job.id)
      );
      keysToRemove.forEach(key => {
        Notification.remove(key);
      });
      const keys = this.props.jobs.map(job => {
        const key = job.id;
        if (!this.state.keys.includes(key)) {
          Notification.info(job.jobData.jobClass, {
            key,
            duration: 0,
            closable: false,
            placement: "bottomLeft",
          });
        }
        return key;
      });
      this.setState({ keys });
    }
  }

  public render() {
    return null;
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => {
  const jobs = getJobs(state);
  return {
    jobs,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<JobsAction, RootState>
): DispatchProps => {
  return bindActionCreators(
    {
      getJobs: fetchJobs,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveJobs);

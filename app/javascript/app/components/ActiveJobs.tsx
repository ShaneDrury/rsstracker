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
  public static getDerivedStateFromProps(props: Props, state: State) {
    const keysToRemove = difference(state.keys, props.jobs.map(job => job.id));
    keysToRemove.forEach(key => {
      Notification.remove(key);
    });
    const keys: string[] = [];
    props.jobs.forEach(job => {
      const key = job.id;
      if (!state.keys.includes(key)) {
        Notification.info(job.jobData.jobClass, {
          key,
          duration: 0,
          closable: false,
          placement: "bottomLeft",
        });
      }
      keys.push(key);
    });
    return { keys };
  }

  public state: State = {
    keys: [],
  };

  public componentDidMount() {
    this.props.getJobs();
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

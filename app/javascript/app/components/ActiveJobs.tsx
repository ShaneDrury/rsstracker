import React from "react";
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

export class ActiveJobs extends React.PureComponent<Props> {
  public componentDidMount() {
    this.props.getJobs();
  }

  public render() {
    return (
      <div>
        {this.props.jobs.map(job => <span key={job.key}>{job.id}&nbsp;</span>)}
      </div>
    );
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

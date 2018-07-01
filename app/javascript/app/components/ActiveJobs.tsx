import { difference, keys } from "lodash";
import React from "react";
import Notification from "react-bulma-notification";
import "react-bulma-notification/build/css/index.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getEpisodeJobs } from "../modules/episodeJobs/selectors";
import { fetchEpisodeIfNeeded } from "../modules/episodes/actions";
import {
  deleteJobAction,
  fetchJobs,
  JobsAction,
} from "../modules/jobs/actions";
import { JobDescription } from "../modules/jobs/descriptions";
import { getJobDescriptions } from "../modules/jobs/selectors";
import { RootState } from "../modules/reducers";
import { Dispatch } from "../types/thunk";

interface EnhancedProps {
  jobDescriptions: JobDescription[];
  relatedEpisodeIds: number[];
}

interface DispatchProps {
  getJobs: () => void;
  onCloseErrorJob: (jobId: string) => void;
  fetchEpisodeIfNeeded: (episodeId: number) => void;
}

type Props = EnhancedProps & DispatchProps;

interface State {
  keys: string[];
}

export class ActiveJobs extends React.PureComponent<Props, State> {
  public static getDerivedStateFromProps(props: Props, state: State) {
    const newKeys = props.jobDescriptions.map(job => job.key);
    const keysToRemove = difference(state.keys, newKeys);
    keysToRemove.forEach(key => {
      Notification.remove(key);
    });
    props.jobDescriptions.forEach(job => {
      const key = job.key;
      if (!state.keys.includes(key)) {
        if (job.error) {
          Notification.error(job.error, {
            key,
            duration: 0,
            closable: true,
            placement: "bottomLeft",
            onClose: () => props.onCloseErrorJob(job.id),
          });
        } else {
          Notification.info(job.description, {
            key,
            duration: 0,
            closable: false,
            placement: "bottomLeft",
          });
        }
      }
    });
    return { keys: newKeys };
  }

  public state: State = {
    keys: [],
  };

  public componentDidMount() {
    this.props.getJobs();
  }

  public componentDidUpdate() {
    this.props.relatedEpisodeIds.forEach(episodeId => {
      this.props.fetchEpisodeIfNeeded(episodeId);
    });
  }

  public render() {
    return null;
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => {
  const jobDescriptions = getJobDescriptions(state);
  return {
    jobDescriptions,
    relatedEpisodeIds: keys(getEpisodeJobs(state)).map(id => parseInt(id, 10)),
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<JobsAction, RootState>
): DispatchProps => {
  return bindActionCreators(
    {
      getJobs: fetchJobs,
      onCloseErrorJob: deleteJobAction,
      fetchEpisodeIfNeeded,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveJobs);

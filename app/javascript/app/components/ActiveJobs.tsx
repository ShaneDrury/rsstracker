import { difference, isEqual, keys } from "lodash";
import React from "react";
import Notification from "react-bulma-notification";
import "react-bulma-notification/build/css/index.css";
import { connect } from "react-redux";
import { getEpisodeJobs } from "../modules/episodeJobs/selectors";
import { fetchEpisodeIfNeeded } from "../modules/episodes/actions";
import { deleteJobAction, fetchJobs } from "../modules/jobs/actions";
import { JobDescription } from "../modules/jobs/descriptions";
import { getJobDescriptions } from "../modules/jobs/selectors";
import { RootState } from "../modules/reducers";

interface EnhancedProps {
  jobDescriptions: JobDescription[];
  relatedEpisodeIds: string[];
}

interface DispatchProps {
  getJobs: () => void;
  onCloseErrorJob: (jobId: string) => void;
  fetchEpisodeIfNeeded: (episodeId: string) => void;
}

type Props = EnhancedProps & DispatchProps;

export class ActiveJobs extends React.PureComponent<Props> {
  public componentDidMount() {
    this.props.getJobs();
  }

  public componentDidUpdate(prevProps: Props) {
    if (!isEqual(this.props.relatedEpisodeIds, prevProps.relatedEpisodeIds)) {
      this.props.relatedEpisodeIds.forEach(episodeId => {
        this.props.fetchEpisodeIfNeeded(episodeId);
      });
    }

    const newKeys = this.props.jobDescriptions.map(job => job.key);
    const prevKeys = prevProps.jobDescriptions.map(job => job.key);
    const keysToRemove = difference(prevKeys, newKeys);
    keysToRemove.forEach(key => {
      Notification.remove(key);
    });
    this.props.jobDescriptions.forEach(job => {
      const key = job.key;
      if (!prevKeys.includes(key)) {
        if (job.error) {
          Notification.error(job.error, {
            key,
            duration: 0,
            closable: true,
            placement: "bottomLeft",
            onClose: () => this.props.onCloseErrorJob(job.id),
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
  }

  public render() {
    return null;
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => {
  const jobDescriptions = getJobDescriptions(state);
  return {
    jobDescriptions,
    relatedEpisodeIds: keys(getEpisodeJobs(state)),
  };
};

const mapDispatchToProps = {
  getJobs: fetchJobs,
  onCloseErrorJob: deleteJobAction,
  fetchEpisodeIfNeeded,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveJobs);

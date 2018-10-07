import { difference, isEqual, keys } from "lodash";
import React from "react";
import NotificationSystem from "react-notification-system";
import { connect } from "react-redux";
import { getEpisodeJobs } from "../modules/episodeJobs/selectors";
import { fetchEpisodeRequested } from "../modules/episodes/actions";
import { deleteJobAction, fetchJobsRequested } from "../modules/jobs/actions";
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
  private notificationSystem = React.createRef<NotificationSystem.System>()!;

  public componentDidMount() {
    this.props.getJobs();
  }

  public componentDidUpdate(prevProps: Props) {
    if (!isEqual(this.props.relatedEpisodeIds, prevProps.relatedEpisodeIds)) {
      this.props.relatedEpisodeIds.forEach(episodeId => {
        this.props.fetchEpisodeIfNeeded(episodeId); // TODO: Move this to saga
      });
    }

    const newKeys = this.props.jobDescriptions.map(job => job.key);
    const prevKeys = prevProps.jobDescriptions.map(job => job.key);
    const keysToRemove = difference(prevKeys, newKeys);
    const notificationSystem = this.notificationSystem.current;
    if (!notificationSystem) {
      return;
    }
    keysToRemove.forEach(key => {
      notificationSystem.removeNotification(key);
    });
    this.props.jobDescriptions.forEach(job => {
      const key = job.key;
      if (!prevKeys.includes(key)) {
        if (job.error) {
          notificationSystem.addNotification({
            message: job.error,
            level: "error",
            position: "bl",
            autoDismiss: 0,
            uid: key,
            onRemove: () => this.props.onCloseErrorJob(job.id),
          });
        } else {
          notificationSystem.addNotification({
            message: job.description,
            level: "info",
            position: "bl",
            autoDismiss: 0,
            dismissible: false,
            uid: key,
          });
        }
      }
    });
  }

  public render() {
    return <NotificationSystem ref={this.notificationSystem} />;
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
  getJobs: fetchJobsRequested,
  onCloseErrorJob: deleteJobAction,
  fetchEpisodeIfNeeded: fetchEpisodeRequested,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveJobs);

import { difference, keys } from "lodash";
import React from "react";
import NotificationSystem from "react-notification-system";
import { connect } from "react-redux";
import { getEpisodeJobs } from "../modules/episodeJobs/selectors";
import { fetchEpisodeRequested } from "../modules/episodes/actions";
import {
  fetchJobsRequested,
  removeJobRequested,
} from "../modules/jobs/actions";
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
    this.props.jobDescriptions.forEach(job => {
      this.notifyJob(job);
    });
  }

  public componentDidUpdate(prevProps: Props) {
    const newKeys = this.props.jobDescriptions.map(job => job.key);
    const prevKeys = prevProps.jobDescriptions.map(job => job.key);
    const keysToRemove = difference(prevKeys, newKeys);
    keysToRemove.forEach(key => {
      this.withNotifier(n => n.removeNotification(key));
    });
    this.props.jobDescriptions.forEach(job => {
      if (!prevKeys.includes(job.key)) {
        this.notifyJob(job);
      }
    });
  }

  public render() {
    return <NotificationSystem ref={this.notificationSystem} />;
  }

  private withNotifier(callback: (n: NotificationSystem.System) => void) {
    const notificationSystem = this.notificationSystem.current;
    if (!notificationSystem) {
      return;
    }
    callback(notificationSystem);
  }

  private notifyJob(job: JobDescription) {
    if (job.error) {
      this.withNotifier(n => {
        n.addNotification({
          // TODO: Move this to saga
          message: job.error,
          level: "error",
          position: "bl",
          autoDismiss: 0,
          uid: job.key,
          onRemove: () => this.props.onCloseErrorJob(job.id),
        });
      });
    } else {
      this.withNotifier(n => {
        n.addNotification({
          message: job.description,
          level: "info",
          position: "bl",
          autoDismiss: 0,
          dismissible: false,
          uid: job.key,
        });
      });
    }
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
  onCloseErrorJob: removeJobRequested,
  fetchEpisodeIfNeeded: fetchEpisodeRequested,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveJobs);

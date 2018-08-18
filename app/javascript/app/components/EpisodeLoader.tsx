import { isEqual } from "lodash";
import React from "react";
import { RemoteEpisode } from "../types/episode";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getEpisodeJobs } from "../modules/episodeJobs/selectors";
import {
  EpisodesAction,
  fetchEpisode,
  searchEpisodes,
} from "../modules/episodes/actions";
import { getEpisodes } from "../modules/episodes/selectors";
import { getFeedJobs } from "../modules/feedJobs/selectors";
import { fetchFeedAction } from "../modules/feeds/actions";
import { getFeedObjects } from "../modules/feeds/selectors";
import { SearchParams } from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import { Dispatch } from "../types/thunk";

interface DataProps {
  children: (remoteEpisode: RemoteEpisode) => JSX.Element;
}

interface EnhancedProps {
  isUpdating: boolean;
  remoteEpisode?: RemoteEpisode;
}

interface DispatchProps {
  fetchEpisode: (episodeId: string) => void;
}

interface PropsExtended {
  episodeId: string;
}

type Props = DataProps & DispatchProps & PropsExtended & EnhancedProps;

class EpisodeLoader extends React.PureComponent<Props> {
  public componentDidMount() {
    this.fetchEpisode();
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.episodeId !== prevProps.episodeId) {
      this.fetchEpisode();
    }
  }

  public fetchEpisode = () => {
    this.props.fetchEpisode(this.props.episodeId);
  };

  public render() {
    if (this.props.remoteEpisode) {
      return this.props.children(this.props.remoteEpisode);
    }
    return <div>LOADING</div>;
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: PropsExtended
): EnhancedProps => {
  const episodeId = ownProps.episodeId;
  const isUpdating = !!getEpisodeJobs(state)[episodeId];
  const remoteEpisode = getEpisodes(state)[episodeId];
  return {
    isUpdating,
    remoteEpisode,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps => {
  return bindActionCreators(
    {
      fetchEpisode,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EpisodeLoader);

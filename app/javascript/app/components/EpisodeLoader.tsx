import React from "react";
import { RemoteEpisode } from "../types/episode";

import { connect } from "react-redux";
import { fetchEpisodeRequested } from "../modules/episodes/actions";
import { getEpisodes } from "../modules/episodes/selectors";
import { RootState } from "../modules/reducers";

interface DataProps {
  children: (remoteEpisode: RemoteEpisode) => JSX.Element;
}

interface EnhancedProps {
  remoteEpisode?: RemoteEpisode;
}

interface DispatchProps {
  fetchEpisode: (episodeId: string) => void;
}

interface PropsExtended {
  episodeId: string;
}

type Props = DataProps & DispatchProps & PropsExtended & EnhancedProps;

const EpisodeLoader: React.FunctionComponent<Props> = ({
  remoteEpisode,
  fetchEpisode,
  episodeId,
  children,
}) => {
  React.useEffect(() => {
    if (!remoteEpisode) {
      fetchEpisode(episodeId);
    }
  }, [episodeId, fetchEpisode, remoteEpisode]);

  if (remoteEpisode) {
    return children(remoteEpisode);
  }
  return <div>LOADING</div>;
};

const mapStateToProps = (
  state: RootState,
  ownProps: PropsExtended
): EnhancedProps => {
  const episodeId = ownProps.episodeId;
  const remoteEpisode = getEpisodes(state)[episodeId];
  return {
    remoteEpisode,
  };
};

const mapDispatchToProps = {
  fetchEpisode: fetchEpisodeRequested,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EpisodeLoader);

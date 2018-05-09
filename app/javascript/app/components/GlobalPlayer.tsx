import React from "react";
import { connect } from "react-redux";
import { getEpisodes } from "../modules/episodes/selectors";
import {
  getPlayedSeconds,
  getPlayingEpisode,
} from "../modules/player/selectors";
import { RootState } from "../modules/reducers";
import { RemoteEpisode } from "../types/episode";
import Player from "./Player";

interface DataProps {}

interface PropsExtended {
  episode?: RemoteEpisode;
  episodeId?: number;
  playedSeconds: number;
}

type Props = DataProps & PropsExtended;

export class GlobalPlayer extends React.PureComponent<Props> {
  public render() {
    return (
      <div>
        {this.props.episodeId && <Player episodeId={this.props.episodeId} />}
        {this.props.episode && <div>{this.props.episode.name}</div>}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): PropsExtended => {
  const episodeId = getPlayingEpisode(state);
  const playedSeconds = episodeId && getPlayedSeconds(state)[episodeId];
  const episode = episodeId ? getEpisodes(state)[episodeId] : undefined;

  return {
    episode,
    episodeId,
    playedSeconds: playedSeconds ? playedSeconds : 0,
  };
};

export default connect(mapStateToProps)(GlobalPlayer);

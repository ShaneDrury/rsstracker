import React from "react";
import { connect } from "react-redux";
import {
  getPlayedSeconds,
  getPlayingEpisode,
} from "../modules/player/selectors";
import { RootState } from "../modules/reducers";
import Player from "./Player";

interface DataProps {}

interface PropsExtended {
  episodeId?: number;
  playedSeconds: number;
}

type Props = DataProps & PropsExtended;

export class GlobalPlayer extends React.PureComponent<Props> {
  public render() {
    return (
      <div>
        {this.props.episodeId && <Player episodeId={this.props.episodeId} />}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): PropsExtended => {
  const episodeId = getPlayingEpisode(state);
  const playedSeconds = episodeId && getPlayedSeconds(state)[episodeId];

  return {
    episodeId,
    playedSeconds: playedSeconds ? playedSeconds : 0,
  };
};

export default connect(mapStateToProps)(GlobalPlayer);

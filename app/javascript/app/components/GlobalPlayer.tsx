import React from "react";
import { connect } from "react-redux";
import { getEpisodes } from "../modules/episodes/selectors";
import { getPlayingEpisode } from "../modules/player/selectors";
import { RootState } from "../modules/reducers";
import Player from "./Player";

interface DataProps {}

interface PropsExtended {
  episodeName?: string;
  episodeId?: number;
}

type Props = DataProps & PropsExtended;

export class GlobalPlayer extends React.PureComponent<Props> {
  public render() {
    return (
      <div>
        {this.props.episodeId && <Player episodeId={this.props.episodeId} />}
        {this.props.episodeName && <div>{this.props.episodeName}</div>}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): PropsExtended => {
  const episodeId = getPlayingEpisode(state);
  const episode = episodeId ? getEpisodes(state)[episodeId] : undefined;
  const episodeName = episode && episode.name;
  return {
    episodeName,
    episodeId,
  };
};

export default connect(mapStateToProps)(GlobalPlayer);

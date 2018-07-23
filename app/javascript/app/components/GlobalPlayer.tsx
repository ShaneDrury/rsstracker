import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchEpisodeIfNeeded } from "../modules/episodes/actions";
import { getEpisodes } from "../modules/episodes/selectors";
import { Action as PlayerAction } from "../modules/player/actions";
import { getPlaying, getPlayingEpisodeId } from "../modules/player/selectors";
import { RootState } from "../modules/reducers";
import { Dispatch } from "../types/thunk";
import Player from "./Player";

interface DataProps {}

interface PropsExtended {
  episodeName?: string;
  episodeId?: string;
  fetched: boolean;
  playing: boolean;
}

interface DispatchProps {
  fetchEpisodeIfNeeded: (episodeId: string) => void;
}

type Props = DataProps & PropsExtended & DispatchProps;

export class GlobalPlayer extends React.PureComponent<Props> {
  public componentDidMount() {
    if (this.props.episodeId) {
      this.props.fetchEpisodeIfNeeded(this.props.episodeId);
    }
  }

  public render() {
    return (
      <div>
        {this.props.fetched &&
          this.props.episodeId && (
            <Player
              episodeId={this.props.episodeId}
              playing={this.props.playing}
            />
          )}
        {this.props.episodeName && <div>{this.props.episodeName}</div>}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): PropsExtended => {
  const episodeId = getPlayingEpisodeId(state);
  const episode = episodeId ? getEpisodes(state)[episodeId] : undefined;
  const episodeName = episode && episode.name;
  const playing = getPlaying(state);
  return {
    episodeName,
    episodeId,
    fetched: !!episode,
    playing,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<PlayerAction, RootState>
): DispatchProps =>
  bindActionCreators(
    {
      fetchEpisodeIfNeeded,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalPlayer);

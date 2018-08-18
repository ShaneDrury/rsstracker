import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  detailsOpened,
  fetchEpisodeIfNeeded,
} from "../modules/episodes/actions";
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
  handleDetailOpened: (episodeId: string) => void;
}

type Props = DataProps & PropsExtended & DispatchProps;

export class GlobalPlayer extends React.PureComponent<Props> {
  public componentDidMount() {
    if (this.props.episodeId) {
      this.props.fetchEpisodeIfNeeded(this.props.episodeId);
    }
  }

  public handleDetailOpened = () => {
    this.props.handleDetailOpened(this.props.episodeId!);
  };

  public render() {
    return (
      <div>
        {this.props.fetched &&
          this.props.episodeId && (
            <div className="columns is-paddingless">
              {this.props.episodeName && (
                <div className="column">{this.props.episodeName}</div>
              )}
              <div className="column">
                <button className="button" onClick={this.handleDetailOpened}>
                  Detail
                </button>
              </div>
              <div className="column">
                <Player
                  episodeId={this.props.episodeId}
                  playing={this.props.playing}
                />
              </div>
            </div>
          )}
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
      handleDetailOpened: detailsOpened,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalPlayer);

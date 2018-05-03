import React from "react";
import FilePlayer from "react-player/lib/players/FilePlayer";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  Action as PlayerAction,
  togglePlay,
  updatePlayedSeconds
} from "../modules/player/actions";
import {
  getPlayedSeconds,
  getPlayingEpisode
} from "../modules/player/selectors";
import { RootState } from "../modules/reducers";

interface DataProps {
  url: string;
}

interface ConnectedProps {
  playing: boolean;
  playedSeconds: number;
}

interface DispatchProps {
  onChangePlayedSeconds: (episodeId: number, playedSeconds: number) => void;
  togglePlay: (episodeId: number) => void;
}

interface PropsExtended {
  episodeId: number;
}

type Props = DataProps & DispatchProps & PropsExtended & ConnectedProps;

export class Player extends React.PureComponent<Props> {
  private player: any = undefined;

  constructor(props: Props) {
    super(props);
    this.handleToggleShow = this.handleToggleShow.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
  }

  public componentDidUpdate(prevProps: Props) {
    if (!prevProps.playing && this.props.playing) {
      if (this.player) {
        this.player.seekTo(this.props.playedSeconds);
      }
    }
  }

  public handleToggleShow() {
    this.props.togglePlay(this.props.episodeId);
  }

  public handleProgress({ playedSeconds }: { playedSeconds: number }) {
    this.props.onChangePlayedSeconds(this.props.episodeId, playedSeconds);
  }

  public render() {
    return (
      <div>
        <button className="button" onClick={this.handleToggleShow}>
          {this.props.playing ? "Stop" : "Play"}
        </button>
        {this.props.playing && (
          <FilePlayer
            ref={this.playerRef}
            url={this.props.url}
            controls
            playing={this.props.playing}
            config={{ file: { forceAudio: true } }}
            onProgress={this.handleProgress}
            progressInterval={1500}
            width="600px"
            height="50px"
          />
        )}
      </div>
    );
  }

  private playerRef = (player: Element) => {
    this.player = player;
  };
}

const mapStateToProps = (
  state: RootState,
  ownProps: PropsExtended
): ConnectedProps => {
  const playingEpisodeId = getPlayingEpisode(state);
  const playing = ownProps.episodeId === playingEpisodeId;
  const playedSeconds = getPlayedSeconds(state)[ownProps.episodeId];
  return {
    playing,
    playedSeconds: playedSeconds ? playedSeconds : 0
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<PlayerAction, RootState>
): DispatchProps => ({
  onChangePlayedSeconds: (episodeId: number, playedSeconds: number) =>
    dispatch(updatePlayedSeconds(episodeId, playedSeconds)),
  togglePlay: (episodeId: number) => dispatch(togglePlay(episodeId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);

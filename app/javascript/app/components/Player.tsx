import React from "react";
import FilePlayer from "react-player/lib/players/FilePlayer";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
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

interface State {
  shouldSeek: boolean;
}

export class Player extends React.PureComponent<Props, State> {
  private player: any = undefined;

  constructor(props: Props) {
    super(props);
    this.state = {
      shouldSeek: false
    };
    this.handleToggleShow = this.handleToggleShow.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleOnReady = this.handleOnReady.bind(this);
  }

  public componentDidUpdate(prevProps: Props) {
    if (!prevProps.playing && this.props.playing) {
      this.setState({
        shouldSeek: true
      });
    }
  }

  public handleOnReady() {
    if (this.player && this.state.shouldSeek) {
      this.player.seekTo(this.props.playedSeconds);
      this.setState({ shouldSeek: false });
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
            onReady={this.handleOnReady}
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
): DispatchProps =>
  bindActionCreators(
    {
      onChangePlayedSeconds: updatePlayedSeconds,
      togglePlay
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Player);

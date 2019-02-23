import React from "react";
import FilePlayer from "react-player/lib/players/FilePlayer";
import { connect } from "react-redux";
import { getEpisodes } from "../modules/episodes/selectors";
import {
  playedSecondsUpdated,
  playerPaused,
  playerResumed,
  playToggled,
} from "../modules/player/actions";
import { getPlayedSeconds } from "../modules/player/selectors";
import { RootState } from "../modules/reducers";
import ReactPlayer from "react-player/lib/players/FilePlayer";

interface ConnectedProps {
  playedSeconds: number;
  url?: string;
}

interface DispatchProps {
  onChangePlayedSeconds: (episodeId: string, playedSeconds: number) => void;
  togglePlay: (episodeId: string) => void;
  playerPaused: () => void;
  playerResumed: () => void;
}

interface PropsExtended {
  episodeId: string;
  playing: boolean;
}

type Props = DispatchProps & PropsExtended & ConnectedProps;

interface State {
  shouldSeek: boolean;
}

export class Player extends React.Component<Props, State> {
  public state = {
    shouldSeek: true,
  };

  private player = React.createRef<ReactPlayer>();

  public shouldComponentUpdate(nextProps: Props) {
    return nextProps.episodeId !== this.props.episodeId;
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.episodeId !== this.props.episodeId) {
      this.seekToPlayedSeconds();
      this.setState({
        shouldSeek: true,
      });
    }
  }

  public handleOnReady = () => {
    if (this.player && this.state.shouldSeek) {
      this.seekToPlayedSeconds();
    }
  };

  public handleToggleShow = () => {
    this.props.togglePlay(this.props.episodeId);
  };

  public handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    this.props.onChangePlayedSeconds(this.props.episodeId, playedSeconds);
  };

  public render() {
    if (this.props.url) {
      return (
        <FilePlayer
          ref={this.player}
          url={this.props.url}
          controls
          playing={this.props.playing}
          config={{ file: { forceAudio: true } }}
          onProgress={this.handleProgress}
          onReady={this.handleOnReady}
          onPause={this.props.playerPaused}
          onStart={this.props.playerResumed}
          progressInterval={1500}
          width="600px"
          height="50px"
        />
      );
    } else {
      return null;
    }
  }

  private seekToPlayedSeconds() {
    this.withPlayer(p => p.seekTo(this.props.playedSeconds));
    this.setState({ shouldSeek: false });
  }

  private withPlayer(callback: (p: ReactPlayer) => void) {
    if (this.player.current) {
      callback(this.player.current);
    }
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: PropsExtended
): ConnectedProps => {
  const playingEpisodeId = ownProps.episodeId;
  const episode = getEpisodes(state)[playingEpisodeId];
  const fetchStatus = episode && episode.fetchStatus;
  const url = fetchStatus.status === "SUCCESS" ? fetchStatus.url : undefined;
  const playedSeconds = getPlayedSeconds(state)[ownProps.episodeId];
  return {
    url,
    playedSeconds: playedSeconds ? playedSeconds : 0,
  };
};

const mapDispatchToProps = {
  onChangePlayedSeconds: playedSecondsUpdated,
  togglePlay: playToggled,
  playerPaused,
  playerResumed,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);

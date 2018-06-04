import React from "react";
import FilePlayer from "react-player/lib/players/FilePlayer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getEpisodes } from "../modules/episodes/selectors";
import {
  Action as PlayerAction,
  togglePlay,
  updatePlayedSeconds,
} from "../modules/player/actions";
import { getPlayedSeconds } from "../modules/player/selectors";
import { RootState } from "../modules/reducers";
import { Dispatch } from "../types/thunk";

interface DataProps {}

interface ConnectedProps {
  playedSeconds: number;
  url?: string;
}

interface DispatchProps {
  onChangePlayedSeconds: (episodeId: number, playedSeconds: number) => void;
  togglePlay: (episodeId: number) => void;
}

interface PropsExtended {
  episodeId: number;
  playing: boolean;
}

type Props = DataProps & DispatchProps & PropsExtended & ConnectedProps;

interface State {
  shouldSeek: boolean;
}

export class Player extends React.Component<Props, State> {
  public state = {
    shouldSeek: true,
  };

  private player: any = undefined;

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
    return (
      <div>
        {this.props.url && (
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
            height="28px"
          />
        )}
      </div>
    );
  }

  private seekToPlayedSeconds() {
    this.player.seekTo(this.props.playedSeconds);
    this.setState({ shouldSeek: false });
  }

  private playerRef = (player: Element) => {
    this.player = player;
  };
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

const mapDispatchToProps = (
  dispatch: Dispatch<PlayerAction, RootState>
): DispatchProps =>
  bindActionCreators(
    {
      onChangePlayedSeconds: updatePlayedSeconds,
      togglePlay,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);

import React from "react";
import FilePlayer from "react-player/lib/players/FilePlayer";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  Action as PlayerAction,
  togglePlay,
  updatePlayedSeconds
} from "../modules/player/actions";
import { getPlayingEpisode } from "../modules/player/selectors";
import { RootState } from "../modules/reducers";

interface DataProps {
  url: string;
}

interface ConnectedProps {
  playing: boolean;
}

interface DispatchProps {
  onChangePlayedSeconds: (playedSeconds: number) => void;
  togglePlay: (episodeId: number) => void;
}

interface PropsExtended {
  episodeId: number;
}

type Props = DataProps & DispatchProps & PropsExtended & ConnectedProps;

export class Player extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleToggleShow = this.handleToggleShow.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
  }

  public handleToggleShow() {
    this.props.togglePlay(this.props.episodeId);
  }

  public handleProgress({ playedSeconds }: { playedSeconds: number }) {
    this.props.onChangePlayedSeconds(playedSeconds);
  }

  public render() {
    return (
      <div>
        <button className="button" onClick={this.handleToggleShow}>
          {this.props.playing ? "Stop" : "Play"}
        </button>
        {this.props.playing && (
          <FilePlayer
            url={this.props.url}
            controls
            playing={this.props.playing}
            config={{ file: { forceAudio: true } }}
            onProgress={this.handleProgress}
            width="600px"
            height="50px"
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: PropsExtended
): ConnectedProps => {
  const playing = ownProps.episodeId === getPlayingEpisode(state);
  return {
    playing
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<PlayerAction, RootState>
): DispatchProps => ({
  onChangePlayedSeconds: (playedSeconds: number) =>
    dispatch(updatePlayedSeconds(playedSeconds)),
  togglePlay: (episodeId: number) => dispatch(togglePlay(episodeId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);

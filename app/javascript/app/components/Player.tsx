import React from "react";
import FilePlayer from "react-player/lib/players/FilePlayer";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  Action as PlayerAction,
  updatePlayedSeconds
} from "../modules/player/actions";
import { RootState } from "../modules/reducers";

interface DataProps {
  url: string;
}

interface DispatchProps {
  onChangePlayedSeconds: (playedSeconds: number) => void;
}

interface State {
  visible: boolean;
}

type Props = DataProps & DispatchProps;

export class Player extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false
    };
    this.handleToggleShow = this.handleToggleShow.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
  }

  public handleToggleShow() {
    this.setState({
      visible: !this.state.visible
    });
  }

  public handleProgress({ playedSeconds }: { playedSeconds: number }) {
    this.props.onChangePlayedSeconds(playedSeconds);
  }

  public render() {
    return (
      <div>
        <button className="button" onClick={this.handleToggleShow}>
          {this.state.visible ? "Stop" : "Play"}
        </button>
        {this.state.visible && (
          <FilePlayer
            url={this.props.url}
            controls
            playing
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

const mapDispatchToProps = (
  dispatch: Dispatch<PlayerAction, RootState>
): DispatchProps => ({
  onChangePlayedSeconds: (playedSeconds: number) =>
    dispatch(updatePlayedSeconds(playedSeconds))
});

export default connect(undefined, mapDispatchToProps)(Player);

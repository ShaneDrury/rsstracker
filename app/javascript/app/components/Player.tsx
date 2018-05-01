import React from "react";
import FilePlayer from "react-player/lib/players/FilePlayer";

interface Props {
  url: string;
}

interface State {
  visible: boolean;
}

export class Player extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false
    };
    this.handleToggleShow = this.handleToggleShow.bind(this);
  }

  public handleToggleShow() {
    this.setState({
      visible: !this.state.visible
    });
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
            width="600px"
            height="50px"
          />
        )}
      </div>
    );
  }
}

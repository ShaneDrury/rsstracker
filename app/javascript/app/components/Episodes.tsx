import React from "react";
import { RemoteData } from "../modules/remoteData";
import { RemoteEpisode } from "../types/episode";
import { Episode } from "./Episode";
import { getEpisodes } from "../modules/episodes/sources";

interface Props {
  feedId: number;
}

interface State {
  remoteData: RemoteData<RemoteEpisode[], string>;
}

export class Episodes extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      remoteData: {
        type: "NOT_ASKED"
      }
    };
  }

  async componentDidMount() {
    const episodes = await getEpisodes(this.props.feedId);
    this.setState({
      remoteData: {
        type: "SUCCESS",
        data: episodes
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.remoteData.type === "SUCCESS" &&
          this.state.remoteData.data.map(episode => (
            <Episode key={episode.id} {...episode} />
          ))}
        {this.state.remoteData.type === "NOT_ASKED" && <div>LOADING</div>}
      </div>
    );
  }
}

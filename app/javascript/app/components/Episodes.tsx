import React from "react";
import { RemoteData } from "../modules/remoteData";
import { RemoteEpisode } from "../types/episode";
import { Episode } from "./Episode";
import { getEpisodes } from "../modules/episodes/sources";
import { Filter } from "../modules/filters";

interface Props {
  feedId: number;
  filter: Filter;
}

interface State {
  remoteData: RemoteData<RemoteEpisode[], string>;
  filter: Filter;
}

export class Episodes extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filter: this.props.filter,
      remoteData: {
        type: "NOT_ASKED"
      }
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.filter !== prevState.filter) {
      return {
        filter: nextProps.filter,
        remoteData: {
          type: "NOT_ASKED"
        }
      };
    }
    return null;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.remoteData.type === "NOT_ASKED") {
      this._loadAsyncData(this.props.filter, this.props.feedId);
    }
  }

  async _loadAsyncData(filter: Filter, feedId: number) {
    const episodes = await getEpisodes(filter, feedId);
    this.setState({
      remoteData: {
        type: "SUCCESS",
        data: episodes
      }
    });
  }

  async componentDidMount() {
    this._loadAsyncData(this.props.filter, this.props.feedId);
  }

  render() {
    console.log("rendering", this.state.remoteData);
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

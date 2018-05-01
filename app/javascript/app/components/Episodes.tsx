import React from "react";
import { getEpisodes } from "../modules/episodes/sources";
import { Filter } from "../modules/filters";
import { RemoteData } from "../modules/remoteData";
import { RemoteEpisode } from "../types/episode";
import { Episode } from "./Episode";

interface Props {
  feedId: number;
  filter: Filter;
}

interface State {
  remoteData: RemoteData<RemoteEpisode[]>;
  feedId: number;
  filter: Filter;
}

export class Episodes extends React.Component<Props, State> {
  public static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (
      nextProps.filter !== prevState.filter ||
      nextProps.feedId !== prevState.feedId
    ) {
      return {
        filter: nextProps.filter,
        feedId: nextProps.feedId,
        remoteData: {
          type: "NOT_ASKED"
        }
      };
    }
    return null;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      filter: this.props.filter,
      feedId: this.props.feedId,
      remoteData: {
        type: "NOT_ASKED"
      }
    };
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.remoteData.type === "NOT_ASKED") {
      this._loadAsyncData(this.props.filter, this.props.feedId);
    }
  }

  public async _loadAsyncData(filter: Filter, feedId: number) {
    const episodes = await getEpisodes(filter, feedId);
    this.setState({
      remoteData: {
        type: "SUCCESS",
        data: episodes
      }
    });
  }

  public async componentDidMount() {
    this._loadAsyncData(this.props.filter, this.props.feedId);
  }

  public render() {
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

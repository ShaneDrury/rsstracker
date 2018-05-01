import React from "react";
import { RemoteFeed } from "../types/feed";

import { getFeed, updateFeed } from "../modules/feeds/sources";
import { Filter } from "../modules/filters";
import { RemoteData } from "../modules/remoteData";
import { Episodes } from "./Episodes";

interface Props {
  feedId: number;
}

interface State {
  filter: Filter;
  remoteData: RemoteData<RemoteFeed, string>;
  feedId?: number;
}

export class Feed extends React.Component<Props, State> {
  public static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.feedId !== prevState.feedId) {
      return {
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
      filter: Filter.ALL,
      remoteData: {
        type: "NOT_ASKED"
      }
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  public handleFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ filter: event.target.value as Filter });
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.remoteData.type === "NOT_ASKED") {
      const feedId = this.props.feedId;
      this._loadAsyncData(feedId);
    }
  }

  public async _loadAsyncData(feedId: number) {
    const feed = await getFeed(feedId);
    this.setState({
      remoteData: {
        type: "SUCCESS",
        data: feed
      }
    });
  }

  public async componentDidMount() {
    const feedId = this.props.feedId;
    this._loadAsyncData(feedId);
  }

  public render() {
    if (this.state.remoteData.type === "SUCCESS") {
      const {
        id,
        name,
        description,
        relativeImageLink,
        updatedAt
      } = this.state.remoteData.data;
      const handleUpdateFeed = () => updateFeed(id);
      return (
        <div className="columns">
          <div className="column is-one-third">
            <div className="card">
              <div className="card-image">
                <figure className="image is-1by1">
                  <img src={relativeImageLink} />
                </figure>
              </div>
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-4">{name}</p>
                  </div>
                </div>
                <div className="content">
                  {description}
                  <br />
                  <time>{updatedAt}</time>
                </div>
                <button
                  className="button is-primary"
                  onClick={handleUpdateFeed}
                >
                  <i className="fas fa-sync" />&nbsp;Update
                </button>
                <select onChange={this.handleFilterChange}>
                  <option value={Filter.ALL}>All</option>
                  <option value={Filter.SUCCESS}>Success</option>
                  <option value={Filter.NOT_ASKED}>Not asked</option>
                  <option value={Filter.LOADING}>Loading</option>
                  <option value={Filter.FAILURE}>Failure</option>
                </select>
              </div>
            </div>
          </div>
          <div className="column">
            <Episodes feedId={id} filter={this.state.filter} />
          </div>
        </div>
      );
    }
    return <div>LOADING</div>;
  }
}

import React from "react";
import { RemoteFeed } from "../types/feed";

import { Episodes } from "./Episodes";
import { getFeed, updateFeed } from "../modules/feeds/sources";
import { Filter } from "../modules/filters";
import { RemoteData } from "../modules/remoteData";

interface Props {
  feedId: number;
}

interface State {
  filter: Filter;
  remoteData: RemoteData<RemoteFeed, string>;
  feedId?: number;
}

export class Feed extends React.Component<Props, State> {
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

  handleFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ filter: event.target.value as Filter });
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
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

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.remoteData.type === "NOT_ASKED") {
      const feedId = this.props.feedId;
      this._loadAsyncData(feedId);
    }
  }

  async _loadAsyncData(feedId: number) {
    const feed = await getFeed(feedId);
    this.setState({
      remoteData: {
        type: "SUCCESS",
        data: feed
      }
    });
  }

  async componentDidMount() {
    const feedId = this.props.feedId;
    this._loadAsyncData(feedId);
  }

  render() {
    if (this.state.remoteData.type === "SUCCESS") {
      const {
        id,
        name,
        description,
        relativeImageLink,
        updatedAt
      } = this.state.remoteData.data;
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
                  onClick={() => updateFeed(id)}
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

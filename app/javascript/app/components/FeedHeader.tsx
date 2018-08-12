import React from "react";
import { RemoteFeed } from "../types/feed";

export class FeedHeader extends React.Component<{ remoteFeed: RemoteFeed }> {
  public render() {
    const { remoteFeed } = this.props;
    return (
      <React.Fragment>
        <header className="card-header">
          <p className="card-header-title">
            <a href={remoteFeed.url}>{remoteFeed.name}</a>
          </p>
        </header>
        <div className="card-image">
          <figure className="image is-1by1">
            <img src={remoteFeed.relativeImageLink} />
          </figure>
        </div>
      </React.Fragment>
    );
  }
}

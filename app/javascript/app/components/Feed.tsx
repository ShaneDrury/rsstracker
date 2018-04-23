import React from "react";
import { RemoteFeed } from "../types/feed";

import { Episodes } from "./Episodes";
import { updateFeed } from "../modules/feeds/sources";

interface Props extends RemoteFeed {}

export const Feed: React.SFC<Props> = ({
  id,
  name,
  description,
  relativeImageLink,
  updatedAt
}) => (
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
        </div>
      </div>
    </div>
    <div className="column">
      <Episodes feedId={id} />
    </div>
  </div>
);

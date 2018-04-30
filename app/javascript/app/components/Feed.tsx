import React from "react";
import { RemoteFeed } from "../types/feed";

import { Episodes } from "./Episodes";
import { updateFeed } from "../modules/feeds/sources";
import { Filter } from "../modules/filters";

interface Props extends RemoteFeed {}

interface State {
  filter: Filter;
}

export class Feed extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filter: Filter.ALL
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ filter: event.target.value as Filter });
  }

  render() {
    const { id, name, description, relativeImageLink, updatedAt } = this.props;
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
}

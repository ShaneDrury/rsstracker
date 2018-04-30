import React from "react";
import { RemoteData } from "../modules/remoteData";
import { RemoteFeed } from "../types/feed";
import { getFeeds } from "../modules/feeds/sources";
import { Link } from "react-router-dom";

interface Props {}

interface State {
  remoteData: RemoteData<RemoteFeed[], string>;
}

export class Feeds extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      remoteData: {
        type: "NOT_ASKED"
      }
    };
  }
  async componentDidMount() {
    const feeds = await getFeeds();
    this.setState({
      remoteData: {
        type: "SUCCESS",
        data: feeds
      }
    });
  }

  render() {
    return (
      <div className="container">
        {this.state.remoteData.type === "SUCCESS" && (
          <ul>
            {this.state.remoteData.data.map(feed => (
              <li key={feed.id}>
                <Link to={`/${feed.id}`}>{feed.name}</Link>
              </li>
            ))}
          </ul>
        )}
        {this.state.remoteData.type === "NOT_ASKED" && <div>LOADING</div>}
      </div>
    );
  }
}

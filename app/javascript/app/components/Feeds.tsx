import React from "react";
import { RemoteData } from "../modules/remoteData";
import { RemoteFeed } from "../types/feed";
import { getFeeds } from "../modules/feeds/sources";
import { Feed } from "./Feed";

interface Props {

}

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
    }
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
      <div>
        {this.state.remoteData.type === "SUCCESS" && (
          this.state.remoteData.data.map(feed => (
            <Feed key={feed.id}
              {...feed}
            />
          ))
        )}
        {this.state.remoteData.type === "NOT_ASKED" && (
          <div>
            LOADING
          </div>
        )}
      </div>
    )
  }
}

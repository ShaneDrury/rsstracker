import * as React from "react";
import { Feed } from "./Feed";
import { getFeed } from "../modules/feeds/sources";
import { RemoteFeed } from "../types/feed";
import { RemoteData } from "../modules/remoteData";

interface Props {
  match: {
    params: {
      feedId: string;
    };
  };
}

interface State {
  remoteData: RemoteData<RemoteFeed, string>;
}

export class FeedContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      remoteData: {
        type: "NOT_ASKED"
      }
    };
  }
  async componentDidMount() {
    const feedId = parseInt(this.props.match.params.feedId);
    const feed = await getFeed(feedId);
    this.setState({
      remoteData: {
        type: "SUCCESS",
        data: feed
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.remoteData.type === "SUCCESS" && (
          <Feed {...this.state.remoteData.data} />
        )}
      </div>
    );
  }
}

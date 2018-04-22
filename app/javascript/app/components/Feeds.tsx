import React from "react";
import apiFetch from "../modules/apiFetch";

export class Feeds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remoteData: {
        type: "NOT_ASKED"
      }
    }
  }
  async componentDidMount() {
    const feeds = await apiFetch("/feeds");
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
            <div key={feed.id}>
              {feed.name}
            </div>
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

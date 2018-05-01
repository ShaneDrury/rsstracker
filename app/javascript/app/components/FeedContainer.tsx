import React from "react";
import Feed from "./Feed";

interface Props {
  match: {
    params: {
      feedId: number;
    };
  };
}

export const FeedContainer: React.SFC<Props> = ({ match }) => (
  <Feed feedId={match.params.feedId} />
);

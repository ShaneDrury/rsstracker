import React from "react";
import { Feed } from "./Feed";

interface Props {
  match: {
    params: {
      feedId: string;
    };
  };
}

export const FeedContainer: React.SFC<Props> = ({ match }) => (
  <Feed feedId={parseInt(match.params.feedId, 10)} />
);

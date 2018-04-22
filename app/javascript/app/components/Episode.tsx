import React from "react";
import { RemoteEpisode } from "../types/episode";
import { downloadEpisode } from "../modules/episodes/sources";

interface Props extends RemoteEpisode {}

export const Episode: React.SFC<Props> = ({
  id,
  name,
  description,
  duration,
  fetchStatus
}) => (
  <div>
    <h2>{name}</h2>
    <h3>{duration}</h3>
    <h3>
      {fetchStatus.status === "SUCCESS" && <a href={fetchStatus.url}>Listen</a>}
      {(fetchStatus.status === "NOT_ASKED" ||
        fetchStatus.status === "FAILURE") && (
        <button onClick={() => downloadEpisode(id)}>Download</button>
      )}
      {fetchStatus.status === "LOADING" && (
        <div>Loading {fetchStatus.percentageFetched}%</div>
      )}
    </h3>
    <p>{description}</p>
  </div>
);

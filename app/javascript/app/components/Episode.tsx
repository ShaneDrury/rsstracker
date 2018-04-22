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
    <h2 className="title">{name}</h2>
    <p className="subtitle">{duration}</p>
    <div className="field">
      {fetchStatus.status === "SUCCESS" && <a href={fetchStatus.url}>Listen</a>}
      {(fetchStatus.status === "NOT_ASKED" ||
        fetchStatus.status === "FAILURE") && (
        <button
          className="button is-primary"
          onClick={() => downloadEpisode(id)}
        >
          Download
        </button>
      )}
      {fetchStatus.status === "LOADING" && (
        <div>Loading {fetchStatus.percentageFetched}%</div>
      )}
    </div>
    <p>{description}</p>
  </div>
);

import React from "react";
import { RemoteEpisode } from "../types/episode";

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
    </h3>
    <p>{description}</p>
  </div>
);

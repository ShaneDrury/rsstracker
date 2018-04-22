import React from "react";
import { RemoteFeed } from "../types/feed";

import { Episodes } from "./Episodes";

interface Props extends RemoteFeed {}

export const Feed: React.SFC<Props> = ({
  id,
  name,
  description,
  relativeImageLink
}) => (
  <div>
    <h2>{name}</h2>
    <img src={relativeImageLink} height={100} width={100} />
    <p>{description}</p>
    <Episodes feedId={id} />
  </div>
);

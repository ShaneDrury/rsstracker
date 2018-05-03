import React from "react";
import { downloadEpisode } from "../modules/episodes/sources";
import { RemoteEpisode } from "../types/episode";
import Player from "./Player";

type Props = RemoteEpisode;

interface DescriptionProps {
  text: string;
}

const Description: React.SFC<DescriptionProps> = ({ text }) => (
  <React.Fragment>
    {text.split("\n").map((item, key) => (
      <span key={key}>
        {item}
        <br />
      </span>
    ))}
  </React.Fragment>
);

export const Episode: React.SFC<Props> = ({
  id,
  name,
  description,
  duration,
  fetchStatus
}) => {
  const handleDownload = () => downloadEpisode(id);
  return (
    <div>
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">{name}</p>
        </header>
        <div className="card-content">
          <div className="content">
            <p>{description && <Description text={description} />}</p>
            <br />
            <time>{duration}</time>
            {fetchStatus.status === "SUCCESS" && (
              <Player url={fetchStatus.url} episodeId={id} />
            )}
          </div>
          <nav className="level is-mobile">
            <div className="level-left">
              {fetchStatus.status === "SUCCESS" && (
                <a className="level-item" href={fetchStatus.url}>
                  <span className="icon is-small">
                    <i className="fas fa-file-audio" />
                  </span>
                </a>
              )}
              {(fetchStatus.status === "NOT_ASKED" ||
                fetchStatus.status === "FAILURE") && (
                <button className="button is-primary" onClick={handleDownload}>
                  Download
                </button>
              )}
              {fetchStatus.status === "LOADING" && (
                <div>Loading {fetchStatus.percentageFetched}%</div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

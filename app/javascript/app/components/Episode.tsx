import React from "react";
import { RemoteEpisode } from "../types/episode";
import { downloadEpisode } from "../modules/episodes/sources";

interface Props extends RemoteEpisode {}

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
}) => (
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
        </nav>
      </div>
    </div>
  </div>
);

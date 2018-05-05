import * as moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { getEpisodes } from "../modules/episodes/selectors";
import { downloadEpisode } from "../modules/episodes/sources";
import { getPlayedSeconds } from "../modules/player/selectors";
import { RootState } from "../modules/reducers";
import { RemoteEpisode } from "../types/episode";
import Player from "./Player";

interface DataProps {
  episodeId: number;
}

interface PropsExtended extends RemoteEpisode {
  playingSeconds?: number;
}

type Props = DataProps & PropsExtended;

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
  fetchStatus,
  playingSeconds
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
            {playingSeconds && (
              <div>
                Played: {moment.duration(playingSeconds, "seconds").humanize()}
              </div>
            )}
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

const mapStateToProps = (
  state: RootState,
  ownProps: DataProps
): PropsExtended => {
  const playingSeconds = getPlayedSeconds(state)[ownProps.episodeId];
  const episode = getEpisodes(state)[ownProps.episodeId];
  return {
    ...episode,
    playingSeconds
  };
};

export default connect(mapStateToProps)(Episode);

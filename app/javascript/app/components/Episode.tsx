import classNames from "classnames";
import * as moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { getEpisodeJobs } from "../modules/episodeJobs/selectors";
import { downloadEpisodeAction } from "../modules/episodes/actions";
import { getEpisodes } from "../modules/episodes/selectors";
import {
  Action as PlayerAction,
  togglePlay as togglePlayAction,
} from "../modules/player/actions";
import {
  getPlayedSeconds,
  getPlayingEpisode,
} from "../modules/player/selectors";
import { RootState } from "../modules/reducers";
import { RemoteEpisode } from "../types/episode";

interface DataProps {
  episodeId: number;
}

interface PropsExtended extends RemoteEpisode {
  playingSeconds?: number;
  playing: boolean;
  isUpdating: boolean;
}

interface DispatchProps {
  togglePlay: (episodeId: number) => void;
  downloadEpisode: (episodeId: number) => void;
}

type Props = DataProps & PropsExtended & DispatchProps;

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
  downloadEpisode,
  duration,
  fetchStatus,
  isUpdating,
  playingSeconds,
  playing,
  publicationDate,
  togglePlay,
}) => {
  const handleDownload = () => downloadEpisode(id);
  const handleToggleShow = () => {
    togglePlay(id);
  };
  return (
    <div>
      <div className="card">
        <header className="card-header">
          <div className="card-header-title">
            {fetchStatus.status === "SUCCESS" && (
              <a className="level-item" href={fetchStatus.url}>
                {name}
              </a>
            )}
            {!(fetchStatus.status === "SUCCESS") && <div>{name}</div>}
          </div>
          {publicationDate && (
            <div className="card-header-icon">
              <time>{moment(publicationDate).format("lll")}</time>
            </div>
          )}
        </header>
        <div className="card-content">
          <div className="content">
            {description && <Description text={description} />}
            <hr />
            {playingSeconds && (
              <span>
                Played: {moment.duration(playingSeconds, "seconds").humanize()}
                {" - "}
              </span>
            )}
            <time>{duration}</time>
            <br />
            {fetchStatus.status === "SUCCESS" && (
              <button
                className={classNames("button", {
                  "is-link": !playing,
                  "is-danger": playing,
                })}
                onClick={handleToggleShow}
              >
                {playing ? "Stop" : "Play"}
              </button>
            )}
          </div>
          {!(fetchStatus.status === "SUCCESS") && (
            <nav className="level is-mobile">
              <div className="level-left">
                {(fetchStatus.status === "NOT_ASKED" ||
                  fetchStatus.status === "FAILURE" ||
                  isUpdating) && (
                  <button
                    className="button is-primary"
                    onClick={handleDownload}
                    disabled={isUpdating}
                  >
                    {isUpdating && (
                      <div>
                        <i className="fas fa-sync fa-spin" />&nbsp;
                      </div>
                    )}
                    Download
                  </button>
                )}
                {fetchStatus.status === "LOADING" && (
                  <div>Loading {fetchStatus.percentageFetched}%</div>
                )}
              </div>
            </nav>
          )}
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
  const playingEpisodeId = getPlayingEpisode(state);
  const playing = ownProps.episodeId === playingEpisodeId;
  const isUpdating = !!getEpisodeJobs(state)[ownProps.episodeId];
  return {
    ...episode,
    isUpdating,
    playingSeconds,
    playing,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<PlayerAction, RootState>
): DispatchProps =>
  bindActionCreators(
    {
      togglePlay: togglePlayAction,
      downloadEpisode: downloadEpisodeAction,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Episode);

import * as moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { getEpisodes } from "../modules/episodes/selectors";
import { downloadEpisode } from "../modules/episodes/sources";
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
}

interface DispatchProps {
  togglePlay: (episodeId: number) => void;
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
  duration,
  fetchStatus,
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
        </header>
        <div className="card-content">
          <div className="content">
            {description && <Description text={description} />}
            <hr />
            {publicationDate && (
              <div>
                Date: <time>{moment(publicationDate).format("lll")}</time>
              </div>
            )}
            {playingSeconds && (
              <div>
                Played: {moment.duration(playingSeconds, "seconds").humanize()}
              </div>
            )}
            <time>{duration}</time>
            <br />
            {fetchStatus.status === "SUCCESS" && (
              <button className="button is-link" onClick={handleToggleShow}>
                {playing ? "Stop" : "Play"}
              </button>
            )}
          </div>
          {!(fetchStatus.status === "SUCCESS") && (
            <nav className="level is-mobile">
              <div className="level-left">
                {(fetchStatus.status === "NOT_ASKED" ||
                  fetchStatus.status === "FAILURE") && (
                  <button
                    className="button is-primary"
                    onClick={handleDownload}
                  >
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
  return {
    ...episode,
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
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Episode);

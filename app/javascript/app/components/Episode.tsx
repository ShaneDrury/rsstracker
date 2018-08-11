import {
  faFileAudio,
  faSpinner,
  faSync,
} from "@fortawesome/fontawesome-free-solid";
import classNames from "classnames";
import * as moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { downloadEpisodeAction } from "../modules/episodeJobs/actions";
import { getEpisodeJobs } from "../modules/episodeJobs/selectors";
import { fetchEpisode } from "../modules/episodes/actions";
import { getEpisodes } from "../modules/episodes/selectors";
import {
  Action as PlayerAction,
  playToggled as togglePlayAction,
} from "../modules/player/actions";
import { getPlayingEpisode } from "../modules/player/selectors";
import { RootState } from "../modules/reducers";
import { RemoteEpisode } from "../types/episode";
import { Dispatch } from "../types/thunk";
import Description from "./Description";
import { Icon } from "./Icon";
import PlayingSeconds from "./PlayingSeconds";

interface DataProps {
  episodeId: string;
}

interface PropsExtended extends RemoteEpisode {
  playing: boolean;
  isUpdating: boolean;
}

interface DispatchProps {
  togglePlay: (episodeId: string) => void;
  downloadEpisode: (episodeId: string) => void;
  fetchEpisode: (episodeId: string) => void;
}

type Props = DataProps & PropsExtended & DispatchProps;

export class Episode extends React.PureComponent<Props> {
  public componentDidUpdate(prevProps: Props) {
    if (prevProps.isUpdating && !this.props.isUpdating) {
      this.props.fetchEpisode(this.props.id);
    }
  }

  public handleDownload = () => {
    this.props.downloadEpisode(this.props.id);
  };

  public handleToggleShow = () => {
    this.props.togglePlay(this.props.id);
  };

  public render() {
    const {
      id,
      name,
      description,
      duration,
      fetchStatus,
      isUpdating,
      playing,
      publicationDate,
      thumbnailUrl,
      fullUrl,
      updating,
    } = this.props;
    return (
      <div className="card">
        {updating && <Icon icon={faSpinner} className="loader" />}
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
          <div className="media">
            <div className="media-content">
              {description && <Description episodeId={id} />}
            </div>
            {thumbnailUrl && (
              <div className="media-right">
                <figure className="image is-128x128">
                  <img src={thumbnailUrl} />
                </figure>
              </div>
            )}
          </div>
          <div className="content">
            <hr />
            <PlayingSeconds episodeId={id} />
            <time>{duration}</time>{" "}
            <a href={fullUrl}>
              <Icon icon={faFileAudio} />
            </a>
            <br />
            {fetchStatus.status === "SUCCESS" && (
              <button
                className={classNames("button", {
                  "is-link": !playing,
                  "is-danger": playing,
                })}
                onClick={this.handleToggleShow}
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
                    onClick={this.handleDownload}
                    disabled={isUpdating}
                  >
                    {isUpdating && (
                      <div>
                        <Icon icon={faSync} spin />
                      </div>
                    )}
                    &nbsp;Download
                  </button>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: DataProps
): PropsExtended => {
  const episode = getEpisodes(state)[ownProps.episodeId];
  const playingEpisodeId = getPlayingEpisode(state);
  const playing = ownProps.episodeId === playingEpisodeId;
  const isUpdating = !!getEpisodeJobs(state)[ownProps.episodeId];
  return {
    ...episode,
    isUpdating,
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
      fetchEpisode,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Episode);

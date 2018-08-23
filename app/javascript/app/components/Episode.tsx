import {
  faDownload,
  faInfoCircle,
  faSpinner,
  faSync,
} from "@fortawesome/fontawesome-free-solid";
import classNames from "classnames";
import * as moment from "moment";
import React from "react";
import Dotdotdot from "react-dotdotdot";
import { connect } from "react-redux";
import styled from "styled-components";
import { downloadEpisodeAction } from "../modules/episodeJobs/actions";
import { getEpisodeJobs } from "../modules/episodeJobs/selectors";
import { detailsOpened, fetchEpisode } from "../modules/episodes/actions";
import { getDetailEpisodeId } from "../modules/episodes/selectors";
import { playToggled as togglePlayAction } from "../modules/player/actions";
import { getPlayingEpisode } from "../modules/player/selectors";
import { RootState } from "../modules/reducers";
import { RemoteEpisode } from "../types/episode";
import { Icon } from "./Icon";

interface DataProps {
  episode: RemoteEpisode;
}

interface PropsExtended {
  playing: boolean;
  isUpdating: boolean;
  isDetailOpen: boolean;
}

interface DispatchProps {
  togglePlay: (episodeId: string) => void;
  downloadEpisode: (episodeId: string) => void;
  fetchEpisode: (episodeId: string) => void;
  handleDetailOpened: (episodeId: string) => void;
}

type Props = DataProps & PropsExtended & DispatchProps;

const TitleWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const NameWrapper = styled.div`
  flex: 1;
`;

const DurationWrapper = styled.time`
  margin-left: auto;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const InfoWrapper = styled.div`
  margin-left: auto;
`;

const EpisodeWrapper = styled.article``;

const FooterWrapper = styled.div`
  display: flex;
  flex: 1;
`;

export class Episode extends React.PureComponent<Props> {
  public componentDidUpdate(prevProps: Props) {
    if (prevProps.isUpdating && !this.props.isUpdating) {
      this.props.fetchEpisode(this.props.episode.id);
    }
  }

  public handleDownload = () => {
    this.props.downloadEpisode(this.props.episode.id);
  };

  public handleToggleShow = () => {
    this.props.togglePlay(this.props.episode.id);
  };

  public handleDetailOpened = () => {
    this.props.handleDetailOpened(this.props.episode.id);
  };

  public render() {
    const {
      name,
      description,
      fetchStatus,
      publicationDate,
      thumbnailUrl,
      updating,
    } = this.props.episode;
    return (
      <EpisodeWrapper className="tile is-child box">
        <TitleWrapper>
          <NameWrapper className="title is-5 is-spaced">
            {fetchStatus.status === "SUCCESS" && (
              <a href={fetchStatus.url}>{name}</a>
            )}
            {!(fetchStatus.status === "SUCCESS") && <div>{name}</div>}
          </NameWrapper>
          {publicationDate && (
            <DurationWrapper className="subtitle is-6">
              {moment(publicationDate).format("ll")}
            </DurationWrapper>
          )}
        </TitleWrapper>
        {updating && <Icon icon={faSpinner} className="loader" />}
        <ContentWrapper>
          <div>
            <Dotdotdot clamp={3}>{description}</Dotdotdot>
          </div>
          <div>
            {thumbnailUrl && (
              <div className="media-right">
                <figure className="image is-128x128">
                  <img src={thumbnailUrl} />
                </figure>
              </div>
            )}
          </div>
        </ContentWrapper>
        <FooterWrapper>
          {fetchStatus.status === "SUCCESS" && (
            <button
              className={classNames("button", {
                "is-link": !this.props.playing,
                "is-danger": this.props.playing,
              })}
              onClick={this.handleToggleShow}
            >
              {this.props.playing ? "Stop" : "Play"}
            </button>
          )}
          {!(fetchStatus.status === "SUCCESS") && (
            <div>
              {(fetchStatus.status === "NOT_ASKED" ||
                fetchStatus.status === "FAILURE" ||
                this.props.isUpdating) && (
                <button
                  className="button is-primary"
                  onClick={this.handleDownload}
                  disabled={this.props.isUpdating}
                >
                  <span className="icon">
                    {this.props.isUpdating ? (
                      <Icon icon={faSync} spin />
                    ) : (
                      <Icon icon={faDownload} />
                    )}
                  </span>
                  <span>Download</span>
                </button>
              )}
            </div>
          )}
          <InfoWrapper>
            <button
              className={classNames("button", {
                "is-static": this.props.isDetailOpen,
              })}
              onClick={this.handleDetailOpened}
            >
              <span className="icon">
                <Icon icon={faInfoCircle} />
              </span>
              <span>Info</span>
            </button>
          </InfoWrapper>
        </FooterWrapper>
      </EpisodeWrapper>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: DataProps
): PropsExtended => {
  const playingEpisodeId = getPlayingEpisode(state);
  const playing = ownProps.episode.id === playingEpisodeId;
  const isUpdating = !!getEpisodeJobs(state)[ownProps.episode.id];
  const detailEpisodeId = getDetailEpisodeId(state);
  return {
    isUpdating,
    playing,
    isDetailOpen: ownProps.episode.id === detailEpisodeId,
  };
};

const mapDispatchToProps = {
  togglePlay: togglePlayAction,
  downloadEpisode: downloadEpisodeAction,
  fetchEpisode,
  handleDetailOpened: detailsOpened,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Episode);

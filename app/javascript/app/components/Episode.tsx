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
import { playToggled as togglePlayAction } from "../modules/player/actions";
import { getPlayingEpisode } from "../modules/player/selectors";
import { RootState } from "../modules/reducers";
import { RemoteEpisode } from "../types/episode";
import { Icon } from "./Icon";

interface DataProps {
  episode: RemoteEpisode;
}

interface PropsExtended extends RemoteEpisode {
  playing: boolean;
  isUpdating: boolean;
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
      this.props.fetchEpisode(this.props.id);
    }
  }

  public handleDownload = () => {
    this.props.downloadEpisode(this.props.id);
  };

  public handleToggleShow = () => {
    this.props.togglePlay(this.props.id);
  };

  public handleDetailOpened = () => {
    this.props.handleDetailOpened(this.props.id);
  };

  public render() {
    const {
      name,
      description,
      fetchStatus,
      isUpdating,
      playing,
      publicationDate,
      thumbnailUrl,
      updating,
    } = this.props;
    return (
      <EpisodeWrapper className="tile is-child box">
        <div className="subtitle">
          <TitleWrapper>
            <div>
              {fetchStatus.status === "SUCCESS" && (
                <a className="level-item" href={fetchStatus.url}>
                  {name}
                </a>
              )}
              {!(fetchStatus.status === "SUCCESS") && (
                <div className="">{name}</div>
              )}
            </div>
            {publicationDate && (
              <DurationWrapper>
                {moment(publicationDate).format("lll")}
              </DurationWrapper>
            )}
          </TitleWrapper>
        </div>
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
                "is-link": !playing,
                "is-danger": playing,
              })}
              onClick={this.handleToggleShow}
            >
              {playing ? "Stop" : "Play"}
            </button>
          )}
          {!(fetchStatus.status === "SUCCESS") && (
            <div>
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
                  {!isUpdating && (
                    <div>
                      <Icon icon={faDownload} />
                    </div>
                  )}
                  &nbsp;Download
                </button>
              )}
            </div>
          )}
          <InfoWrapper>
            <button
              className="button"
              onClick={this.handleDetailOpened}
              disabled={isUpdating}
            >
              <Icon icon={faInfoCircle} />
              &nbsp;Info
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
  const episode = ownProps.episode;
  const playingEpisodeId = getPlayingEpisode(state);
  const playing = ownProps.episode.id === playingEpisodeId;
  const isUpdating = !!getEpisodeJobs(state)[ownProps.episode.id];
  return {
    ...episode,
    isUpdating,
    playing,
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

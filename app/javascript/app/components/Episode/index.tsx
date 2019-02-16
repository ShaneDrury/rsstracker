import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import format from "date-fns/format";
import React from "react";
import Dotdotdot from "react-dotdotdot";
import { connect } from "react-redux";
import VisibilitySensor from "react-visibility-sensor";
import styled from "styled-components";
import { downloadEpisodeRequested } from "../../modules/episodeJobs/actions";
import { getEpisodeJobs } from "../../modules/episodeJobs/selectors";
import {
  detailsOpened,
  visibilityChanged,
} from "../../modules/episodes/actions";
import {
  getDetailEpisodeId,
  getEpisodes,
} from "../../modules/episodes/selectors";
import { FetchStatus } from "../../modules/fetchStatus";
import { playToggled as togglePlayAction } from "../../modules/player/actions";
import { getPlayingEpisode } from "../../modules/player/selectors";
import { RootState } from "../../modules/reducers";
import { Icon } from "../Icon";
import EpisodeFooter from "./EpisodeFooter";

interface DataProps {
  episodeId: string;
}

interface PropsExtended {
  name: string;
  description: string;
  publicationDate: string;
  relativeImageLink?: string;
  updating: boolean;
  playing: boolean;
  isUpdating: boolean;
  isDetailOpen: boolean;
  fetchStatus: FetchStatus;
  seen: boolean;
}

interface DispatchProps {
  togglePlay: (episodeId: string) => void;
  downloadEpisode: (episodeId: string) => void;
  handleDetailOpened: (episodeId: string) => void;
  onVisibilityChange: (isVisible: boolean, episodeId: string) => void;
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

const EpisodeWrapper = styled.article``;

const FooterWrapper = styled.div`
  display: flex;
  flex: 1;
`;

export class Episode extends React.Component<Props> {
  public shouldComponentUpdate(nextProps: Props) {
    const { fetchStatus } = this.props;
    const { fetchStatus: fetchStatusNext } = nextProps;
    if (fetchStatus.status !== fetchStatusNext.status) {
      return true;
    }

    return (
      this.props.name !== nextProps.name ||
      this.props.description !== nextProps.description ||
      this.props.publicationDate !== nextProps.publicationDate ||
      this.props.relativeImageLink !== nextProps.relativeImageLink ||
      this.props.updating !== nextProps.updating ||
      this.props.playing !== nextProps.playing ||
      this.props.isUpdating !== nextProps.isUpdating ||
      this.props.isDetailOpen !== nextProps.isDetailOpen ||
      this.props.seen !== nextProps.seen
    );
  }

  public handleToggleShow = () => {
    this.props.togglePlay(this.props.episodeId);
  };

  public handleDetailOpened = () => {
    this.props.handleDetailOpened(this.props.episodeId);
  };

  public handleDownload = () => {
    this.props.downloadEpisode(this.props.episodeId);
  };

  public onVisibilityChange = (isVisible: boolean) => {
    this.props.onVisibilityChange(isVisible, this.props.episodeId);
  };

  public renderEpisode = () => {
    const {
      name,
      description,
      fetchStatus,
      publicationDate,
      relativeImageLink,
      updating,
    } = this.props;
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
              {format(publicationDate, "MMM Do YYYY")}
            </DurationWrapper>
          )}
        </TitleWrapper>
        {updating && <Icon icon={faSpinner} className="loader" />}
        <ContentWrapper>
          <div>
            <Dotdotdot clamp={3}>{description || "No description"}</Dotdotdot>
          </div>
          <div>
            {relativeImageLink && (
              <div className="media-right">
                <figure className="image is-128x128">
                  <img src={relativeImageLink} />
                </figure>
              </div>
            )}
          </div>
        </ContentWrapper>
        <FooterWrapper>
          <EpisodeFooter
            handleDetailOpened={this.handleDetailOpened}
            handleDownload={this.handleDownload}
            fetchStatus={this.props.fetchStatus}
            handleToggleShow={this.handleToggleShow}
            playing={this.props.playing}
            isUpdating={this.props.isUpdating}
            isDetailOpen={this.props.isDetailOpen}
            seen={this.props.seen}
          />
        </FooterWrapper>
      </EpisodeWrapper>
    );
  };

  public render() {
    return this.props.seen ? (
      this.renderEpisode()
    ) : (
      <VisibilitySensor onChange={this.onVisibilityChange}>
        {() => this.renderEpisode()}
      </VisibilitySensor>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: DataProps
): PropsExtended => {
  const playingEpisodeId = getPlayingEpisode(state);
  const playing = ownProps.episodeId === playingEpisodeId;
  const isUpdating = !!getEpisodeJobs(state)[ownProps.episodeId];
  const detailEpisodeId = getDetailEpisodeId(state);
  const episode = getEpisodes(state)[ownProps.episodeId];
  return {
    name: episode.name,
    description: episode.description,
    publicationDate: episode.publicationDate,
    relativeImageLink: episode.relativeImageLink,
    updating: episode.updating,
    fetchStatus: episode.fetchStatus,
    seen: episode.seen,
    isUpdating,
    playing,
    isDetailOpen: ownProps.episodeId === detailEpisodeId,
  };
};

const mapDispatchToProps = {
  togglePlay: togglePlayAction,
  downloadEpisode: downloadEpisodeRequested,
  handleDetailOpened: detailsOpened,
  onVisibilityChange: visibilityChanged,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Episode);

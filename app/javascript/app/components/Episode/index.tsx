import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import format from "date-fns/format";
import React from "react";
import Dotdotdot from "react-dotdotdot";
import { connect } from "react-redux";
import VisibilitySensor from "react-visibility-sensor/visibility-sensor";
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
  smallThumbnail?: string;
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

const Title = styled.div`
  display: flex;
  flex: 1;
`;

const Name = styled.div`
  flex: 1;
`;

const Date = styled.time`
  margin-left: auto;
`;

const Thumbnail = styled.div`
  margin-left: auto;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
`;

const EpisodeWrapper = styled.article``;

const Footer = styled.div`
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
      this.props.smallThumbnail !== nextProps.smallThumbnail ||
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
      smallThumbnail,
      updating,
    } = this.props;
    return (
      <EpisodeWrapper className="tile is-child box">
        <Title>
          <Name className="title is-5 is-spaced">
            {fetchStatus.status === "SUCCESS" && (
              <a href={fetchStatus.url}>{name}</a>
            )}
            {!(fetchStatus.status === "SUCCESS") && <div>{name}</div>}
          </Name>
          {publicationDate && (
            <Date className="subtitle is-6">
              {format(publicationDate, "MMM Do YYYY")}
            </Date>
          )}
        </Title>
        {updating && <Icon icon={faSpinner} className="loader" />}
        <Content>
          <div>
            <Dotdotdot clamp={3}>{description || "No description"}</Dotdotdot>
          </div>
          <Thumbnail>
            {smallThumbnail && (
              <div className="media-right">
                <figure className="image is-128x128">
                  <img src={smallThumbnail} />
                </figure>
              </div>
            )}
          </Thumbnail>
        </Content>
        <Footer>
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
        </Footer>
      </EpisodeWrapper>
    );
  };

  public render() {
    return this.props.seen ? (
      this.renderEpisode()
    ) : (
      <VisibilitySensor onChange={this.onVisibilityChange}>
        {this.renderEpisode()}
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
    smallThumbnail: episode.smallThumbnail,
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

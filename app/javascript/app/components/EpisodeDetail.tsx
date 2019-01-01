import {
  faDownload,
  faFileAudio,
  faHeart,
  faPlay,
  faSpinner,
  faStop,
  faSync,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { isEqual } from "lodash";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { downloadEpisodeRequested } from "../modules/episodeJobs/actions";
import { getEpisodeJobs } from "../modules/episodeJobs/selectors";
import { detailsClosed } from "../modules/episodes/actions";
import {
  favouriteAdded,
  favouriteRemoved,
} from "../modules/favourites/actions";
import { getFavouritesIds } from "../modules/favourites/selectors";
import { playToggled as togglePlayAction } from "../modules/player/actions";
import { getPlayingEpisode } from "../modules/player/selectors";
import { RootState } from "../modules/reducers";
import { RemoteEpisode } from "../types/episode";
import DateField from "./DateField";
import Description from "./Description";
import { Icon } from "./Icon";

interface DataProps {
  episode: RemoteEpisode;
}

interface PropsExtended extends RemoteEpisode {
  playing: boolean;
  isUpdating: boolean;
  isFavourited: boolean;
}

interface DispatchProps {
  togglePlay: (episodeId: string) => void;
  downloadEpisode: (episodeId: string) => void;
  onCloseDetail: () => void;
  onAddFavourite: (episodeId: string) => void;
  onRemoveFavourite: (episodeId: string) => void;
}

type Props = DataProps & PropsExtended & DispatchProps;

const TitleWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const NameWrapper = styled.div`
  flex: 1;
`;

const CloseButtonWrapper = styled.div`
  margin-left: auto;
`;

const EpisodeWrapper = styled.article``;

const FooterWrapper = styled.div`
  display: flex;
  flex: 1;
`;

export class Episode extends React.Component<Props> {
  public shouldComponentUpdate(nextProps: Props) {
    return !isEqual(nextProps, this.props);
  }

  public handleDownload = () => {
    this.props.downloadEpisode(this.props.id);
  };

  public handleToggleShow = () => {
    this.props.togglePlay(this.props.id);
  };

  public handleToggleFavourite = () => {
    if (this.props.isFavourited) {
      this.props.onRemoveFavourite(this.props.id);
    } else {
      this.props.onAddFavourite(this.props.id);
    }
  };

  public render() {
    const {
      id,
      name,
      description,
      duration,
      fetchStatus,
      publicationDate,
      relativeImageLink,
      fullUrl,
      updating,
      isFavourited,
    } = this.props;
    return (
      <div className="tile is-parent">
        <EpisodeWrapper className="tile is-child box">
          <TitleWrapper>
            <NameWrapper className="title is-5 is-spaced">
              {fetchStatus.status === "SUCCESS" && (
                <a href={fetchStatus.url}>{name}</a>
              )}
              {!(fetchStatus.status === "SUCCESS") && <div>{name}</div>}
            </NameWrapper>
            <button
              className={classNames("button", {
                "is-link": !isFavourited,
                "is-success": isFavourited,
              })}
              onClick={this.handleToggleFavourite}
            >
              <span className="icon">
                <Icon icon={faHeart} />
              </span>
            </button>
            <CloseButtonWrapper>
              <button className="button" onClick={this.props.onCloseDetail}>
                <Icon icon={faWindowClose} />
              </button>
            </CloseButtonWrapper>
          </TitleWrapper>
          <div>
            {relativeImageLink && (
              <figure className="image">
                <img src={relativeImageLink} />
              </figure>
            )}
          </div>
          <div className="content">
            {updating && <Icon icon={faSpinner} className="loader" />}
            {publicationDate && (
              <time>
                Publication date:{" "}
                <DateField key={id} episodeId={id} date={publicationDate} />
              </time>
            )}
            <div>
              Duration: <time>{duration}</time>
            </div>
            <div>
              <a href={fullUrl}>
                Source: <Icon icon={faFileAudio} />
              </a>
            </div>
            <div>
              <Description
                key={id}
                episodeId={id}
                text={description}
                placeholder="No description"
              />
            </div>
          </div>
          <FooterWrapper>
            {fetchStatus.status === "SUCCESS" && (
              <button
                className={classNames("button", {
                  "is-link": !this.props.playing,
                  "is-danger": this.props.playing,
                })}
                onClick={this.handleToggleShow}
              >
                <span className="icon">
                  {this.props.playing ? (
                    <Icon icon={faStop} />
                  ) : (
                    <Icon icon={faPlay} />
                  )}
                </span>
                <span>{this.props.playing ? "Stop" : "Play"}</span>
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
          </FooterWrapper>
        </EpisodeWrapper>
      </div>
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
  const isFavourited = getFavouritesIds(state).includes(ownProps.episode.id);
  return {
    ...episode,
    isUpdating,
    playing,
    isFavourited,
  };
};

const mapDispatchToProps = {
  togglePlay: togglePlayAction,
  downloadEpisode: downloadEpisodeRequested,
  onCloseDetail: detailsClosed,
  onAddFavourite: favouriteAdded,
  onRemoveFavourite: favouriteRemoved,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Episode);

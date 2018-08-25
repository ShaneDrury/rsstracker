import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  detailsOpened,
  fetchEpisodeIfNeeded,
} from "../modules/episodes/actions";
import { getDetailEpisodeId, getEpisodes } from "../modules/episodes/selectors";
import { getPlaying, getPlayingEpisodeId } from "../modules/player/selectors";
import { RootState } from "../modules/reducers";
import { Icon } from "./Icon";
import Player from "./Player";

interface DataProps {}

interface PropsExtended {
  episodeName?: string;
  episodeId?: string;
  fetched: boolean;
  playing: boolean;
  isDetailOpen: boolean;
}

interface DispatchProps {
  fetchEpisodeIfNeeded: (episodeId: string) => void;
  handleDetailOpened: (episodeId: string) => void;
}

type Props = DataProps & PropsExtended & DispatchProps;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
`;

const NameWrapper = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: auto;
`;

const InfoButtonWrapper = styled.div`
  flex: none;
  margin-right: 1.5rem;
`;

const PlayerWrapper = styled.div`
  flex: none;
  margin-left: auto;
  margin-top: auto;
`;

export class GlobalPlayer extends React.PureComponent<Props> {
  public componentDidMount() {
    if (this.props.episodeId) {
      this.props.fetchEpisodeIfNeeded(this.props.episodeId);
    }
  }

  public handleDetailOpened = () => {
    this.props.handleDetailOpened(this.props.episodeId!);
  };

  public render() {
    if (this.props.fetched && this.props.episodeId) {
      return (
        <Wrapper>
          {this.props.episodeName && (
            <NameWrapper>{this.props.episodeName}</NameWrapper>
          )}
          <InfoButtonWrapper>
            <button
              className={classnames("button", {
                "is-static": this.props.isDetailOpen,
              })}
              onClick={this.handleDetailOpened}
            >
              <span className="icon">
                <Icon icon={faInfoCircle} />
              </span>
              <span>Info</span>
            </button>
          </InfoButtonWrapper>
          <PlayerWrapper>
            <Player
              episodeId={this.props.episodeId}
              playing={this.props.playing}
            />
          </PlayerWrapper>
        </Wrapper>
      );
    }
    return null;
  }
}

const mapStateToProps = (state: RootState): PropsExtended => {
  const episodeId = getPlayingEpisodeId(state);
  const episode = episodeId ? getEpisodes(state)[episodeId] : undefined;
  const episodeName = episode && episode.name;
  const playing = getPlaying(state);
  const detailEpisodeId = getDetailEpisodeId(state);
  return {
    episodeName,
    episodeId,
    fetched: !!episode,
    playing,
    isDetailOpen: detailEpisodeId === episodeId,
  };
};

const mapDispatchToProps = {
  fetchEpisodeIfNeeded,
  handleDetailOpened: detailsOpened,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalPlayer);

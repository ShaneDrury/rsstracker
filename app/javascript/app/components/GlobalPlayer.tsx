import { faInfoCircle, faPlay } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  detailsOpened,
  fetchEpisodeRequested,
} from "../modules/episodes/actions";
import { getDetailEpisodeId, getEpisodes } from "../modules/episodes/selectors";
import { getPlaying, getPlayingEpisodeId } from "../modules/player/selectors";
import { RootState } from "../modules/reducers";
import { Icon } from "./Icon";
import Player from "./Player";

interface PropsExtended {
  episodeName?: string;
  episodeId?: string;
  fetched: boolean;
  playing: boolean;
  isDetailOpen: boolean;
}

interface DispatchProps {
  fetchEpisode: (episodeId: string) => void;
  handleDetailOpened: (episodeId: string) => void;
}

type Props = PropsExtended & DispatchProps;

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
  margin: auto 1.5rem auto auto;
`;

const PlayerWrapper = styled.div`
  flex: none;
  margin-left: auto;
  margin-top: auto;
`;

interface State {
  active: boolean;
}

export class GlobalPlayer extends React.Component<Props, State> {
  public state = {
    active: false,
  };

  public componentDidMount() {
    if (this.props.episodeId && !this.props.fetched) {
      this.props.fetchEpisode(this.props.episodeId);
    }
  }

  public handleDetailOpened = () => {
    if (!this.props.episodeId) {
      return;
    }
    this.props.handleDetailOpened(this.props.episodeId);
  };

  public handleShow = () => {
    this.setState({ active: true });
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
            {this.state.active ? (
              <Player
                episodeId={this.props.episodeId}
                playing={this.props.playing}
              />
            ) : (
              <button className="button" onClick={this.handleShow}>
                <Icon icon={faPlay} />
              </button>
            )}
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
  fetchEpisode: fetchEpisodeRequested,
  handleDetailOpened: detailsOpened,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalPlayer);

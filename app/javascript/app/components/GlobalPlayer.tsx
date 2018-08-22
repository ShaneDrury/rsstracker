import { faInfoCircle } from "@fortawesome/fontawesome-free-solid";
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
  flex: 1;
`;

const Name = styled.div`
  flex: 3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: auto;
`;

const ButtonWrapper = styled.div`
  flex: none;
`;

const PlayerWrapper = styled.div`
  flex: 1;
  margin: auto;
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
    return (
      <div>
        {this.props.fetched &&
          this.props.episodeId && (
            <Wrapper>
              {this.props.episodeName && <Name>{this.props.episodeName}</Name>}
              <PlayerWrapper>
                <Player
                  episodeId={this.props.episodeId}
                  playing={this.props.playing}
                />
              </PlayerWrapper>
              <ButtonWrapper>
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
              </ButtonWrapper>
            </Wrapper>
          )}
      </div>
    );
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

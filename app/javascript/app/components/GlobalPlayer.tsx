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
  onDetailOpened: (episodeId: string) => void;
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

const GlobalPlayer: React.FunctionComponent<Props> = ({
  episodeId,
  fetched,
  episodeName,
  fetchEpisode,
  onDetailOpened,
  isDetailOpen,
  playing,
}) => {
  const [active, setActive] = React.useState(false);

  const handleDetailOpened = () => {
    if (!episodeId) {
      return;
    }
    onDetailOpened(episodeId);
  };

  const handleShow = () => {
    setActive(true);
  };

  React.useEffect(() => {
    if (episodeId && !fetched) {
      fetchEpisode(episodeId);
    }
  });

  if (fetched && episodeId) {
    return (
      <Wrapper>
        {episodeName && <NameWrapper>{episodeName}</NameWrapper>}
        <InfoButtonWrapper>
          <button
            className={classnames("button", {
              "is-static": isDetailOpen,
            })}
            onClick={handleDetailOpened}
          >
            <span className="icon">
              <Icon icon={faInfoCircle} />
            </span>
            <span>Info</span>
          </button>
        </InfoButtonWrapper>
        <PlayerWrapper>
          {active ? (
            <Player episodeId={episodeId} playing={playing} />
          ) : (
            <button className="button" onClick={handleShow}>
              <Icon icon={faPlay} />
            </button>
          )}
        </PlayerWrapper>
      </Wrapper>
    );
  }
  return null;
};

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
  onDetailOpened: detailsOpened,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalPlayer);

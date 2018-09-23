import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { detailsOpened } from "../modules/episodes/actions";
import { getFavouritesIds } from "../modules/favourites/selectors";
import { RootState } from "../modules/reducers";
import { RemoteEpisode } from "../types/episode";
import EpisodeLoader from "./EpisodeLoader";

interface DataProps {}

interface EnhancedProps {
  favouritesIds: string[];
}

interface DispatchProps {
  handleDetailOpened: (episodeId: string) => void;
}

type Props = DataProps & EnhancedProps & DispatchProps;

const FavouritesWrapper = styled.nav`
  margin: 0.75rem;
`;

class FavouriteItem extends React.PureComponent<{
  episode: RemoteEpisode;
  handleDetailOpened: (episodeId: string) => void;
}> {
  public handleDetailOpened = () => {
    this.props.handleDetailOpened(this.props.episode.id);
  };
  public render() {
    return (
      <a className="panel-block is-active" onClick={this.handleDetailOpened}>
        {this.props.episode.name}
      </a>
    );
  }
}

export class Favourites extends React.PureComponent<Props> {
  public render() {
    return (
      <FavouritesWrapper className="panel">
        {this.props.favouritesIds.map(episodeId => (
          <EpisodeLoader episodeId={episodeId} key={episodeId}>
            {episode => (
              <FavouriteItem
                episode={episode}
                handleDetailOpened={this.props.handleDetailOpened}
              />
            )}
          </EpisodeLoader>
        ))}
      </FavouritesWrapper>
    );
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => {
  return {
    favouritesIds: getFavouritesIds(state),
  };
};

const mapDispatchToProps = {
  handleDetailOpened: detailsOpened,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Favourites);

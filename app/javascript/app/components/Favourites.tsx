import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { detailsOpened } from "../modules/episodes/actions";
import { getFavouritesIds } from "../modules/favourites/selectors";
import { RootState } from "../modules/reducers";
import EpisodeLoader from "./EpisodeLoader";
import FavouriteItem from "./FavouriteItem";

interface DataProps {}

interface EnhancedProps {
  favouritesIds: string[];
}

type Props = DataProps & EnhancedProps;

const FavouritesWrapper = styled.nav`
  margin: 0.75rem;
`;

export class Favourites extends React.PureComponent<Props> {
  public render() {
    return (
      <FavouritesWrapper className="panel">
        {this.props.favouritesIds.map(episodeId => (
          <EpisodeLoader episodeId={episodeId} key={episodeId}>
            {episode => <FavouriteItem episode={episode} />}
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

import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { detailsOpened } from "../modules/episodes/actions";
import { getFavouritesIds } from "../modules/favourites/selectors";
import { RootState } from "../modules/reducers";
import EpisodeLoader from "./EpisodeLoader";
import FavouriteItem from "./FavouriteItem";
import { useIsTabletOrMobile } from "../modules/media";

interface EnhancedProps {
  favouritesIds: string[];
}

type Props = EnhancedProps;

const FavouritesWrapper = styled.ul`
  width: 300px;
  margin: 0.75rem;
`;

const FavouriteItemWrapper = styled.li`
  display: inline-flex;
  width: 300px;
`;

export class Favourites extends React.PureComponent<Props> {
  public render() {
    return (
      <FavouritesWrapper>
        <div className="has-text-grey is-4">Favourites</div>
        {this.props.favouritesIds.map(episodeId => (
          <FavouriteItemWrapper key={episodeId}>
            <EpisodeLoader episodeId={episodeId}>
              {episode => <FavouriteItem episode={episode} />}
            </EpisodeLoader>
          </FavouriteItemWrapper>
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

const FavouritesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Favourites);

const FavouritesOrNull = () => {
  if (useIsTabletOrMobile()) {
    return null;
  }
  return <FavouritesContainer />;
};

export default FavouritesOrNull;

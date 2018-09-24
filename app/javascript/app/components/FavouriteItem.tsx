import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { detailsOpened } from "../modules/episodes/actions";
import { getDetailEpisodeId } from "../modules/episodes/selectors";
import { RootState } from "../modules/reducers";
import { RemoteEpisode } from "../types/episode";

interface DataProps {
  episode: RemoteEpisode;
}

interface EnhancedProps {
  isActive: boolean;
}

interface DispatchProps {
  handleDetailOpened: (episodeId: string) => void;
}

type Props = DataProps & EnhancedProps & DispatchProps;

const NameWrapper = styled.a`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

class FavouriteItem extends React.PureComponent<Props> {
  public handleDetailOpened = () => {
    this.props.handleDetailOpened(this.props.episode.id);
  };

  public render() {
    return (
      <NameWrapper onClick={this.handleDetailOpened}>
        {this.props.episode.name}
      </NameWrapper>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: DataProps
): EnhancedProps => {
  const isActive = getDetailEpisodeId(state) === ownProps.episode.id;
  return {
    isActive,
  };
};

const mapDispatchToProps = {
  handleDetailOpened: detailsOpened,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavouriteItem);

import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
import React from "react";
import { connect } from "react-redux";
import { detailsOpened } from "../modules/episodes/actions";
import { getDetailEpisodeId } from "../modules/episodes/selectors";
import { favouriteRemoved } from "../modules/favourites/actions";
import { RootState } from "../modules/reducers";
import { RemoteEpisode } from "../types/episode";
import { Icon } from "./Icon";

interface DataProps {
  episode: RemoteEpisode;
}

interface EnhancedProps {
  isActive: boolean;
}

interface DispatchProps {
  handleDetailOpened: (episodeId: string) => void;
  onRemoveFavourite: (episodeId: string) => void;
}

type Props = DataProps & EnhancedProps & DispatchProps;

class FavouriteItem extends React.PureComponent<Props> {
  public handleDetailOpened = () => {
    this.props.handleDetailOpened(this.props.episode.id);
  };

  public handleRemoveFavourite = () => {
    this.props.onRemoveFavourite(this.props.episode.id);
  };

  public render() {
    return (
      <div
        className={classnames("panel-block", {
          "is-active": this.props.isActive,
        })}
      >
        <a onClick={this.handleDetailOpened}>{this.props.episode.name}</a>
        <button className="button" onClick={this.handleRemoveFavourite}>
          <Icon icon={faWindowClose} />
        </button>
      </div>
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
  onRemoveFavourite: favouriteRemoved,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavouriteItem);

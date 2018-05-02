import React from "react";
import { RemoteFeed } from "../types/feed";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  changeFilter,
  EpisodesAction,
  fetchEpisodes
} from "../modules/episodes/actions";
import { getFilter } from "../modules/episodes/selectors";
import { getFeeds } from "../modules/feeds/selectors";
import { updateFeed } from "../modules/feeds/sources";
import { Filter } from "../modules/filters";
import { RootState } from "../modules/reducers";
import { RemoteData } from "../modules/remoteData";
import Episodes from "./Episodes";

interface DataProps {
  remoteFeed?: RemoteData<RemoteFeed>;
  filter: Filter;
  feedId: number;
}

interface DispatchProps {
  changeFilter: (filter: Filter) => void;
  fetchEpisodes: () => void;
}

interface PropsExtended {
  match: {
    params: {
      feedId: number;
    };
  };
}
type Props = DataProps & DispatchProps & PropsExtended;

export class Feed extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  public componentDidMount() {
    this.props.fetchEpisodes();
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.feedId !== this.props.feedId) {
      this.props.fetchEpisodes();
    }
  }

  public handleFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.props.changeFilter(event.target.value as Filter);
  }

  public render() {
    if (this.props.remoteFeed && this.props.remoteFeed.type === "SUCCESS") {
      const {
        id,
        name,
        description,
        relativeImageLink,
        updatedAt
      } = this.props.remoteFeed.data;
      const handleUpdateFeed = () => updateFeed(id);
      return (
        <div className="columns">
          <div className="column is-one-third">
            <div className="card">
              <div className="card-image">
                <figure className="image is-1by1">
                  <img src={relativeImageLink} />
                </figure>
              </div>
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-4">{name}</p>
                  </div>
                </div>
                <div className="content">
                  {description}
                  <br />
                  <time>{updatedAt}</time>
                </div>
                <button
                  className="button is-primary"
                  onClick={handleUpdateFeed}
                >
                  <i className="fas fa-sync" />&nbsp;Update
                </button>
                <select
                  onChange={this.handleFilterChange}
                  value={this.props.filter}
                >
                  <option value={Filter.ALL}>All</option>
                  <option value={Filter.SUCCESS}>Success</option>
                  <option value={Filter.NOT_ASKED}>Not asked</option>
                  <option value={Filter.LOADING}>Loading</option>
                  <option value={Filter.FAILURE}>Failure</option>
                </select>
              </div>
            </div>
          </div>
          <div className="column">
            <Episodes feedId={id} />
          </div>
        </div>
      );
    }
    return <div>LOADING</div>;
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: PropsExtended
): DataProps => {
  const feedId = ownProps.match.params.feedId;
  const remoteFeed = getFeeds(state)[feedId];
  const filter = getFilter(state);
  return {
    remoteFeed,
    filter,
    feedId
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>,
  ownProps: PropsExtended
): DispatchProps => ({
  changeFilter: (filter: Filter) =>
    dispatch(changeFilter(ownProps.match.params.feedId)(filter)),
  fetchEpisodes: () => dispatch(fetchEpisodes(ownProps.match.params.feedId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);

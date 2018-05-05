import React from "react";
import { RemoteFeed } from "../types/feed";

import * as qs from "qs";
import { DebounceInput } from "react-debounce-input";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import { EpisodesAction, searchEpisodes } from "../modules/episodes/actions";
import { getFeeds } from "../modules/feeds/selectors";
import { updateFeed } from "../modules/feeds/sources";
import { Filter } from "../modules/filters";
import { RootState } from "../modules/reducers";
import { RemoteData } from "../modules/remoteData";
import { history } from "../store";
import Episodes from "./Episodes";

interface DataProps {
  remoteFeed?: RemoteData<RemoteFeed>;
  filter: Filter;
  feedId: number;
  searchTerm: string;
}

interface DispatchProps {
  onChangeFilter: (filter: Filter, searchTerm: string, feedId: number) => void;
  fetchEpisodes: (filter: Filter, searchTerm: string, feedId: number) => void;
  onChangeSearch: (filter: Filter, searchTerm: string, feedId: number) => void;
}

interface PropsExtended extends RouteComponentProps<{ feedId: number }> {}

type Props = DataProps & DispatchProps & PropsExtended;

export class Feed extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  public componentDidMount() {
    this.props.fetchEpisodes(
      this.props.filter,
      this.props.searchTerm,
      this.props.feedId
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.feedId !== this.props.feedId) {
      this.props.fetchEpisodes(
        this.props.filter,
        this.props.searchTerm,
        this.props.feedId
      );
    }
  }

  public handleFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const filter = event.target.value as Filter;
    const params = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    const queryParams = qs.stringify({ ...params, filter });
    history.push({ search: `?${queryParams}` });
    this.props.onChangeFilter(
      event.target.value as Filter,
      this.props.searchTerm,
      this.props.feedId
    );
  }

  public handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = event.target.value;
    const params = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    const queryParams = qs.stringify({ ...params, searchTerm });
    history.push({ search: `?${queryParams}` });
    this.props.onChangeSearch(this.props.filter, searchTerm, this.props.feedId);
  }

  public render() {
    if (this.props.remoteFeed && this.props.remoteFeed.type === "SUCCESS") {
      const {
        id,
        name,
        description,
        relativeImageLink,
        updatedAt,
        url
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
                    <p className="title is-4">
                      <a href={url}>{name}</a>
                    </p>
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
                <DebounceInput
                  minLength={2}
                  debounceTimeout={300}
                  type="text"
                  onChange={this.handleSearch}
                  value={this.props.searchTerm}
                />
              </div>
            </div>
          </div>
          <div className="column">
            <Episodes />
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
  const params = qs.parse(ownProps.location.search, {
    ignoreQueryPrefix: true
  });
  const filterParam = params.filter;
  const filter: Filter = (filterParam as Filter) || Filter.ALL;

  const searchTerm = params.searchTerm || "";

  const feedId = ownProps.match.params.feedId;
  const remoteFeed = getFeeds(state)[feedId];
  return {
    remoteFeed,
    feedId,
    filter,
    searchTerm
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps => {
  return bindActionCreators(
    {
      onChangeFilter: searchEpisodes,
      fetchEpisodes: searchEpisodes,
      onChangeSearch: searchEpisodes
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Feed);

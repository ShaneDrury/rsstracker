import React from "react";
import { RemoteFeed } from "../types/feed";

import * as moment from "moment";
import * as qs from "qs";
import { DebounceInput } from "react-debounce-input";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import { EpisodesAction, searchEpisodes } from "../modules/episodes/actions";
import { getFeedObjects, getFetchStatus } from "../modules/feeds/selectors";
import { updateFeed } from "../modules/feeds/sources";
import { Filter } from "../modules/filters";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";
import { history } from "../store";
import Episodes from "./Episodes";
import StatusSelect from "./StatusSelect";

interface DataProps {
  remoteFeed: RemoteFeed;
  fetchStatus: FetchStatus;
  filter: Filter;
  feedId: number;
  searchTerm: string;
}

interface DispatchProps {
  onChangeFilter: (feedId: number) => void;
  fetchEpisodes: (feedId: number) => void;
  onChangeSearch: (feedId: number) => void;
}

interface PropsExtended extends RouteComponentProps<{ feedId: number }> {}

type Props = DataProps & DispatchProps & PropsExtended;

const updateQueryParams = (
  previous: string,
  changes: { [key: string]: string }
) => {
  const params = qs.parse(previous, {
    ignoreQueryPrefix: true,
  });
  return qs.stringify({ ...params, ...changes });
};

export class Feed extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  public componentDidMount() {
    this.props.fetchEpisodes(this.props.feedId);
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.feedId !== this.props.feedId) {
      this.props.fetchEpisodes(this.props.feedId);
    }
  }

  public handleFilterChange(filter: Filter) {
    const queryParams = updateQueryParams(this.props.location.search, {
      filter,
    });
    history.push({ search: `?${queryParams}` });
    this.props.onChangeFilter(this.props.feedId);
  }

  public handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = event.target.value;
    const queryParams = updateQueryParams(this.props.location.search, {
      searchTerm,
    });
    history.push({ search: `?${queryParams}` });
    this.props.onChangeSearch(this.props.feedId);
  }

  public render() {
    if (this.props.remoteFeed && this.props.fetchStatus === "SUCCESS") {
      const {
        id,
        name,
        description,
        relativeImageLink,
        updatedAt,
        url,
      } = this.props.remoteFeed;
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
                <button
                  className="button is-primary"
                  onClick={handleUpdateFeed}
                >
                  <i className="fas fa-sync" />&nbsp;Update
                </button>
                <div className="field">
                  <label className="label">Status</label>
                  <div className="control">
                    <div className="select">
                      <StatusSelect
                        filter={this.props.filter}
                        onChangeFilter={this.handleFilterChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <DebounceInput
                      minLength={1}
                      debounceTimeout={300}
                      type="text"
                      className="input"
                      placeholder="Search..."
                      onChange={this.handleSearch}
                      value={this.props.searchTerm}
                    />
                  </div>
                </div>
                <div className="content">
                  {description}
                  <br />
                  Updated at: <time>{moment(updatedAt).format("lll")}</time>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <Episodes feedId={this.props.feedId} />
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
    ignoreQueryPrefix: true,
  });
  const filterParam = params.filter;
  const filter: Filter = (filterParam as Filter) || Filter.ALL;

  const searchTerm = params.searchTerm || "";

  const feedId = ownProps.match.params.feedId;
  const remoteFeed = getFeedObjects(state)[feedId];
  const fetchStatus = getFetchStatus(state);
  return {
    remoteFeed,
    feedId,
    fetchStatus,
    filter,
    searchTerm,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps => {
  return bindActionCreators(
    {
      onChangeFilter: searchEpisodes,
      fetchEpisodes: searchEpisodes,
      onChangeSearch: searchEpisodes,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Feed);

import { History } from "history";
import React from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EpisodesAction, searchEpisodes } from "../modules/episodes/actions";
import { updateFeedAction } from "../modules/feedJobs/actions";
import { getFetchStatus } from "../modules/feeds/selectors";
import { SearchParams } from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";
import { Dispatch } from "../types/thunk";
import Search from "./Search";
import StatusSelect from "./StatusSelect";
import UpdateFeeds from "./UpdateFeeds";

import { isEqual } from "lodash";
import { getUpdatingFeeds } from "../modules/feedJobs/selectors";

interface DataProps {
  history: History;
}

interface EnhancedProps {
  fetchStatus: FetchStatus;
  loadingFeeds: string[];
}

interface DispatchProps {
  fetchEpisodes: (queryParams: SearchParams) => void;
  updateFeed: (feedId: string) => void;
}

interface PropsExtended {
  queryParams: SearchParams;
}

type Props = DataProps & DispatchProps & PropsExtended & EnhancedProps;

export class AllFeedsSidePanel extends React.Component<Props> {
  public componentDidMount() {
    this.props.fetchEpisodes(this.props.queryParams);
  }

  public shouldComponentUpdate(nextProps: Props) {
    return !isEqual(this.props, nextProps);
  }

  public componentDidUpdate(prevProps: Props) {
    if (
      !isEqual(this.props.queryParams, prevProps.queryParams) &&
      this.props.fetchStatus !== "LOADING"
    ) {
      this.props.fetchEpisodes(this.props.queryParams);
    }
    if (
      prevProps.loadingFeeds.length > 0 &&
      this.props.loadingFeeds.length === 0
    ) {
      this.props.fetchEpisodes(this.props.queryParams);
    }
  }

  public render() {
    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">All Feeds</p>
        </header>
        <div className="card-content">
          <div className="field">
            <div className="control">
              <UpdateFeeds />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <div className="select">
                <StatusSelect
                  status={this.props.queryParams.status}
                  queryParams={this.props.queryParams}
                  history={this.props.history}
                />
              </div>
            </div>
            <div className="control is-expanded">
              <Search
                searchTerm={this.props.queryParams.searchTerm}
                queryParams={this.props.queryParams}
                history={this.props.history}
              />
            </div>
          </div>
          <hr />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => {
  const fetchStatus = getFetchStatus(state);
  const loadingFeeds = getUpdatingFeeds(state);

  return {
    loadingFeeds,
    fetchStatus,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps => {
  return bindActionCreators(
    {
      fetchEpisodes: searchEpisodes,
      updateFeed: updateFeedAction,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllFeedsSidePanel);

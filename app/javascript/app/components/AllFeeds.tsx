import React from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EpisodesAction, searchEpisodes } from "../modules/episodes/actions";
import { updateFeedAction } from "../modules/feedJobs/actions";
import { getFetchStatus } from "../modules/feeds/selectors";
import { QueryParams } from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";
import { Dispatch } from "../types/thunk";
import Episodes from "./Episodes";
import Search from "./Search";
import StatusSelect from "./StatusSelect";
import UpdateFeeds from "./UpdateFeeds";

import { isEqual } from "lodash";
import { getUpdatingFeeds } from "../modules/feedJobs/selectors";

interface DataProps {
  fetchStatus: FetchStatus;
  loadingFeeds: string[];
}

interface DispatchProps {
  fetchEpisodes: (queryParams: QueryParams) => void;
  updateFeed: (feedId: string) => void;
}

interface PropsExtended {
  queryParams: QueryParams;
}

type Props = DataProps & DispatchProps & PropsExtended;

export class AllFeeds extends React.Component<Props> {
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
    if (this.props.fetchStatus === "SUCCESS") {
      return (
        <div className="columns">
          <div className="column is-one-quarter">
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
                      <StatusSelect />
                    </div>
                  </div>
                  <div className="control is-expanded">
                    <Search />
                  </div>
                </div>
                <hr />
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

const mapStateToProps = (state: RootState): DataProps => {
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
)(AllFeeds);

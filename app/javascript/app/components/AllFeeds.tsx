import React from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EpisodesAction, searchEpisodes } from "../modules/episodes/actions";
import { updateFeedAction } from "../modules/feeds/actions";
import { getFetchStatus } from "../modules/feeds/selectors";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";
import { Dispatch } from "../types/thunk";
import AllStatusSelect from "./AllStatusSelect";
import Episodes from "./Episodes";
import Search from "./Search";
import UpdateFeeds from "./UpdateFeeds";

interface DataProps {
  fetchStatus: FetchStatus;
}

interface DispatchProps {
  fetchEpisodes: () => void;
  updateFeed: (feedId: number) => void;
}

type Props = DataProps & DispatchProps;

export class AllFeeds extends React.PureComponent<Props> {
  public componentDidMount() {
    this.props.fetchEpisodes();
  }

  public componentDidUpdate(prevProps: Props) {
    this.props.fetchEpisodes();
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
                      <AllStatusSelect />
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
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(AllFeeds);

import React from "react";
import { connect } from "react-redux";
import {
  getFetchStatus,
  getLoadedEpisodes,
  getPageInfo,
} from "../modules/episodes/selectors";
import { RootState } from "../modules/reducers";
import { RemoteEpisode } from "../types/episode";

import * as ReactPaginate from "react-paginate";
import { bindActionCreators } from "redux";
import { changePage, EpisodesAction } from "../modules/episodes/actions";
import { FetchStatus } from "../modules/remoteData";
import { PageInfo } from "../types/page";
import { Dispatch } from "../types/thunk";
import Episode from "./Episode";

interface DataProps {}

interface EnhancedProps {
  remoteEpisodes: RemoteEpisode[];
  fetchStatus: FetchStatus;
  pageInfo?: PageInfo;
}

interface DispatchProps {
  onPageChange: (page: number) => void;
}

type Props = DataProps & DispatchProps & EnhancedProps;

export class Episodes extends React.PureComponent<Props> {
  public handlePageChange = ({ selected }: { selected: number }) => {
    this.props.onPageChange(selected + 1);
  };

  public render() {
    const pageInfo = this.props.pageInfo;
    return (
      <div>
        {this.props.fetchStatus === "LOADING" && <div>Loading...</div>}
        {this.props.fetchStatus === "SUCCESS" &&
          this.props.remoteEpisodes.length === 0 && <div>No results.</div>}
        {this.props.remoteEpisodes.map(remoteEpisode => (
          <Episode episodeId={remoteEpisode.id} key={remoteEpisode.key} />
        ))}
        {pageInfo &&
          pageInfo.totalPages > 1 && (
            <nav
              className="pagination"
              role="navigation"
              aria-label="pagination"
            >
              <ReactPaginate
                pageCount={pageInfo.totalPages}
                forcePage={pageInfo.currentPage - 1}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                activeClassName="pagination-link is-current"
                pageLinkClassName="pagination-link"
                containerClassName="pagination-list"
                previousClassName="pagination-previous"
                nextClassName="pagination-next"
                breakClassName="pagination-ellipsis"
                onPageChange={this.handlePageChange}
              />
            </nav>
          )}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => {
  const remoteEpisodes = getLoadedEpisodes(state);
  const fetchStatus = getFetchStatus(state);
  const pageInfo = getPageInfo(state);
  return {
    remoteEpisodes,
    fetchStatus,
    pageInfo,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps =>
  bindActionCreators(
    {
      onPageChange: changePage,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Episodes);

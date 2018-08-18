import React from "react";
import { connect } from "react-redux";
import {
  getFetchStatus,
  getLoadedEpisodes,
  getPageInfo,
} from "../modules/episodes/selectors";
import { RootState } from "../modules/reducers";
import { RemoteEpisode } from "../types/episode";

import { History } from "history";
import { QueryParams, syncQueryParams } from "../modules/location/queryParams";
import { FetchStatus } from "../modules/remoteData";
import { PageInfo } from "../types/page";
import Episode from "./Episode";
import Pagination from "./Pagination";

interface DataProps {
  queryParams: QueryParams;
  history: History;
}

interface EnhancedProps {
  remoteEpisodes: RemoteEpisode[];
  fetchStatus: FetchStatus;
  pageInfo?: PageInfo;
}

type Props = DataProps & EnhancedProps;

export class Episodes extends React.PureComponent<Props> {
  public handleChangePage = ({ selected }: { selected: number }) => {
    syncQueryParams(
      { currentPage: selected + 1 },
      this.props.queryParams,
      this.props.history
    );
  };

  public render() {
    const pageInfo = this.props.pageInfo;
    return (
      <div>
        {this.props.fetchStatus === "SUCCESS" &&
          this.props.remoteEpisodes.length === 0 && <div>No results.</div>}
        {this.props.remoteEpisodes.map(remoteEpisode => (
          <Episode episode={remoteEpisode} key={remoteEpisode.key} />
        ))}
        {pageInfo &&
          pageInfo.totalPages > 1 && (
            <nav
              className="pagination"
              role="navigation"
              aria-label="pagination"
            >
              <Pagination
                pageCount={pageInfo.totalPages}
                forcePage={pageInfo.currentPage - 1}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                activePageLinkClassName="pagination-link is-current"
                pageLinkClassName="pagination-link"
                containerClassName="pagination-list"
                previousClassName="pagination-previous"
                nextClassName="pagination-next"
                breakClassName="pagination-ellipsis"
                onPageChange={this.handleChangePage}
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

export default connect(mapStateToProps)(Episodes);

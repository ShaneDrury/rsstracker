import { isEqual } from "lodash";
import React from "react";
import { connect } from "react-redux";
import {
  getPageInfo,
  getSortedEpisodeIds,
} from "../modules/episodes/selectors";
import { RootState } from "../modules/reducers";
import { PageInfo } from "../types/page";
import Episode from "./Episode";
import Pagination from "./Pagination";

interface DataProps {
  handleChangePage: (selected: number) => void;
}

interface EnhancedProps {
  remoteEpisodeIds: string[];
  pageInfo: PageInfo;
}

type Props = DataProps & EnhancedProps;

export class Episodes extends React.Component<Props> {
  public handleChangePage = ({ selected }: { selected: number }) => {
    this.props.handleChangePage(selected + 1);
  };

  public shouldComponentUpdate(nextProps: Props) {
    if (!isEqual(nextProps.remoteEpisodeIds, this.props.remoteEpisodeIds)) {
      return true;
    }
    return !isEqual(nextProps.pageInfo, this.props.pageInfo);
  }

  public render() {
    const pageInfo = this.props.pageInfo;
    return (
      <div className="tile is-parent is-vertical">
        {this.props.remoteEpisodeIds.map(remoteEpisodeId => (
          <Episode episodeId={remoteEpisodeId} key={remoteEpisodeId} />
        ))}
        {pageInfo.totalPages > 1 && (
          <nav className="pagination" role="navigation" aria-label="pagination">
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
  const remoteEpisodeIds = getSortedEpisodeIds(state);
  const pageInfo = getPageInfo(state);
  return {
    remoteEpisodeIds,
    pageInfo,
  };
};

export default connect(mapStateToProps)(Episodes);

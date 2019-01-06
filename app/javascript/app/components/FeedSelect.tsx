import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import {
  faDotCircle,
  faRss,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { History } from "history";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchFeedsRequested } from "../modules/feeds/actions";
import { getFeeds, getFetchStatus } from "../modules/feeds/selectors";
import { QueryParams, syncQueryParams } from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";
import { RemoteFeed } from "../types/feed";
import { Icon } from "./Icon";
import Search from "./Search";
import UpdateFeeds from "./UpdateFeeds";

interface DataProps {
  queryParams: QueryParams;
  feedId?: string;
  history: History;
}

interface EnhancedProps {
  remoteFeeds: RemoteFeed[];
  fetchStatus: FetchStatus;
}

interface DispatchProps {
  fetchFeeds: () => void;
}

type Props = DataProps & EnhancedProps & DispatchProps;

const FeedSelectWrapper = styled.nav`
  margin: 0.75rem;
`;

const PanelHeadingWrapper = styled.div`
  display: flex;
  flex: 1;
`;

export class FeedSelect extends React.PureComponent<Props> {
  public componentDidMount() {
    this.props.fetchFeeds();
  }

  public handleChangeSearch = (searchTerm: string) => {
    syncQueryParams({ searchTerm }, this.props.queryParams, this.props.history);
  };

  public render() {
    return (
      <FeedSelectWrapper className="panel">
        <PanelHeadingWrapper className="panel-heading">
          <span>Feeds</span>
        </PanelHeadingWrapper>
        {this.props.fetchStatus === "SUCCESS" &&
          this.props.remoteFeeds.length === 0 && <div>No results.</div>}
        <Link
          className={classNames("panel-block", {
            "is-active": !this.props.feedId,
          })}
          to="/"
        >
          <span className="panel-icon">
            <Icon icon={faDotCircle} />
          </span>
          <span>All Feeds</span>
        </Link>
        {this.props.remoteFeeds.map(remoteFeed => (
          <Link
            className={classNames("panel-block", {
              "is-active": this.props.feedId === remoteFeed.id,
            })}
            key={remoteFeed.key}
            to={`/${remoteFeed.id}`}
          >
            {remoteFeed.sources[0] && (
              <span className="panel-icon">
                {remoteFeed.sources[0].sourceType === "youtube" ? (
                  <Icon icon={faYoutube} />
                ) : (
                  <Icon icon={faRss} />
                )}
              </span>
            )}
            <span>{remoteFeed.name}</span>
          </Link>
        ))}
        <div className="panel-block">
          <UpdateFeeds className="is-fullwidth is-outlined" />
        </div>
        <div className="panel-block">
          <p className="control has-icons-left">
            <Search
              onChangeSearch={this.handleChangeSearch}
              searchTerm={this.props.queryParams.searchTerm}
            />
            <span className="icon is-small is-left">
              <Icon icon={faSearch} />
            </span>
          </p>
        </div>
      </FeedSelectWrapper>
    );
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => {
  const remoteFeeds = getFeeds(state);
  const fetchStatus = getFetchStatus(state);
  return {
    remoteFeeds,
    fetchStatus,
  };
};

const mapDispatchToProps = {
  fetchFeeds: fetchFeedsRequested,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedSelect);

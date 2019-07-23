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
import { Link, Route, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import { getFeeds, getFetchStatus } from "../modules/feeds/selectors";
import {
  parseLocation,
  QueryParams,
  syncQueryParams,
} from "../modules/location/queryParams";
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

const PanelHeadingWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const SearchPanel = () => {
  return (
    <FeedSelectContainer>
      {({ queryParams, history }) => {
        const handleChangeSearch = (searchTerm: string) => {
          syncQueryParams({ searchTerm }, queryParams, history);
        };
        return (
          <div className="panel-block">
            <p className="control has-icons-left">
              <Search
                onChangeSearch={handleChangeSearch}
                searchTerm={queryParams.searchTerm}
              />
              <span className="icon is-small is-left">
                <Icon icon={faSearch} />
              </span>
            </p>
          </div>
        );
      }}
    </FeedSelectContainer>
  );
};

const FeedSelectPanel = ({ remoteFeeds, fetchStatus }: EnhancedProps) => {
  return (
    <FeedSelectContainer>
      {({ feedId }) => (
        <React.Fragment>
          <PanelHeadingWrapper className="panel-heading">
            <span>Feeds</span>
          </PanelHeadingWrapper>
          {fetchStatus === "SUCCESS" && remoteFeeds.length === 0 && (
            <div>No results.</div>
          )}
          <Link
            className={classNames("panel-block", {
              "is-active": !feedId,
            })}
            to="/"
          >
            <span className="panel-icon">
              <Icon icon={faDotCircle} />
            </span>
            <span>All Feeds</span>
          </Link>
          {remoteFeeds.map(remoteFeed => (
            <Link
              className={classNames("panel-block", {
                "is-active": feedId === remoteFeed.id,
              })}
              key={remoteFeed.key}
              to={`/${remoteFeed.id}`}
            >
              {remoteFeed.sourceType && (
                <span className="panel-icon">
                  {remoteFeed.sourceType === "youtube" ? (
                    <Icon icon={faYoutube} />
                  ) : (
                    <Icon icon={faRss} />
                  )}
                </span>
              )}
              <span>{remoteFeed.name}</span>
            </Link>
          ))}
        </React.Fragment>
      )}
    </FeedSelectContainer>
  );
};

export const UpdateFeedsPanel = () => (
  <div className="panel-block">
    <UpdateFeeds className="is-fullwidth is-outlined" />
  </div>
);

const mapStateToProps = (state: RootState): EnhancedProps => {
  const remoteFeeds = getFeeds(state);
  const fetchStatus = getFetchStatus(state);
  return {
    remoteFeeds,
    fetchStatus,
  };
};

export const FeedSelectPanelContainer = connect(mapStateToProps)(
  FeedSelectPanel
);
export const UpdateFeedsContainer = connect(mapStateToProps)(UpdateFeedsPanel);
export const SearchPanelContainer = connect(mapStateToProps)(SearchPanel);

export const FeedSelectContainer = ({
  children,
}: {
  children: ({ feedId, queryParams, history }: DataProps) => JSX.Element;
}) => {
  const renderRoot = ({
    history,
    location,
    match,
  }: RouteComponentProps<{ feedId?: string }>) => {
    const queryParams = parseLocation(location);
    return children({ feedId: match.params.feedId, queryParams, history });
  };

  return <Route path="/:feedId?" render={renderRoot} />;
};

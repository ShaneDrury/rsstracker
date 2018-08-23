import { faPodcast, faRss } from "@fortawesome/fontawesome-free-solid";
import classNames from "classnames";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchFeedsAction } from "../modules/feeds/actions";
import { getFeeds, getFetchStatus } from "../modules/feeds/selectors";
import { QueryParams } from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import { FetchStatus } from "../modules/remoteData";
import { RemoteFeed } from "../types/feed";
import { Icon } from "./Icon";
import UpdateFeeds from "./UpdateFeeds";

interface DataProps {
  queryParams: QueryParams;
  feedId?: string;
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
  margin: 1.5rem;
`;

const PanelHeadingWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const UpdateFeedsWrapper = styled.span`
  margin-left: auto;
`;

export class FeedSelect extends React.PureComponent<Props> {
  public componentDidMount() {
    this.props.fetchFeeds();
  }

  public render() {
    return (
      <FeedSelectWrapper className="panel">
        <PanelHeadingWrapper className="panel-heading">
          <span>Feeds</span>
          <UpdateFeedsWrapper>
            <UpdateFeeds />
          </UpdateFeedsWrapper>
        </PanelHeadingWrapper>
        {this.props.fetchStatus === "SUCCESS" &&
          this.props.remoteFeeds.length === 0 && <div>No results.</div>}
        <Link
          className={classNames("panel-block", {
            "is-active": !this.props.feedId,
          })}
          to="/"
        >
          All Feeds
        </Link>
        {this.props.remoteFeeds.map(remoteFeed => (
          <Link
            className={classNames("panel-block", {
              "is-active": this.props.feedId === remoteFeed.id,
            })}
            key={remoteFeed.key}
            to={`/${remoteFeed.id}`}
          >
            <span className="icon">
              {remoteFeed.source === "youtube" ? (
                <Icon icon={faPodcast} />
              ) : (
                <Icon icon={faRss} />
              )}
            </span>
            <span>{remoteFeed.name}</span>
          </Link>
        ))}
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
  fetchFeeds: fetchFeedsAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedSelect);

import { Location } from "history";
import * as qs from "qs";
import React from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { QueryParams } from "../modules/location/queryParams";
import { Navbar } from "./Navbar";

import { connect } from "react-redux";
import styled from "styled-components";
import { getDetailEpisodeId } from "../modules/episodes/selectors";
import { RootState } from "../modules/reducers";
import AllFeedsLoader from "./AllFeedsLoader";
import EpisodeDetail from "./EpisodeDetail";
import EpisodeLoader from "./EpisodeLoader";
import Episodes from "./Episodes";
import FeedSelect from "./FeedSelect";

const parseLocation = (location: Location): QueryParams =>
  qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

const Wrapper = styled.div`
  display: flex;
`;

const Sidebar = styled.section`
  flex: none;
`;

const Content = styled.section`
  flex: 1;
`;

const Aside = styled.aside`
  flex: 1;
`;

const Scrollable = styled.div`
  height: calc(100vh - 60px);
  overflow-y: scroll;
  overflow-x: hidden;
`;

interface EnhancedProps {
  detailEpisodeId?: string;
}

type Props = EnhancedProps;

class PrimaryContent extends React.Component<Props> {
  public renderRoot = ({
    history,
    location,
    match,
  }: RouteComponentProps<{ feedId?: string }>) => {
    const queryParams = parseLocation(location);
    return (
      <main>
        <Navbar queryParams={queryParams} history={history} />
        <Wrapper>
          <Sidebar>
            <FeedSelect
              queryParams={queryParams}
              feedId={match.params.feedId}
            />
          </Sidebar>
          <Content>
            <AllFeedsLoader
              queryParams={queryParams}
              feedId={match.params.feedId}
            >
              <Scrollable>
                <Episodes queryParams={queryParams} history={history} />
              </Scrollable>
            </AllFeedsLoader>
          </Content>
          <Aside>
            {this.props.detailEpisodeId && (
              <Scrollable>
                <EpisodeLoader episodeId={this.props.detailEpisodeId}>
                  {remoteEpisode => <EpisodeDetail episode={remoteEpisode} />}
                </EpisodeLoader>
              </Scrollable>
            )}
          </Aside>
        </Wrapper>
      </main>
    );
  };

  public render() {
    return <Route path="/:feedId?" render={this.renderRoot} />;
  }
}

const mapStateToProps = (state: RootState): EnhancedProps => ({
  detailEpisodeId: getDetailEpisodeId(state),
});

export default connect(mapStateToProps)(PrimaryContent);

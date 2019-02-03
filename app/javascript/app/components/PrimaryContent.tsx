import { History, Location } from "history";
import * as qs from "qs";
import React from "react";
import { connect } from "react-redux";
import { Route, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import { getDetailEpisodeId } from "../modules/episodes/selectors";
import { QueryParams, syncQueryParams } from "../modules/location/queryParams";
import { RootState } from "../modules/reducers";
import EpisodeDetail from "./EpisodeDetail";
import EpisodeLoader from "./EpisodeLoader";
import Episodes from "./Episodes";
import EpisodesLoader from "./EpisodesLoader";
import Favourites from "./Favourites";
import FeedSelect from "./FeedSelect";
import { Navbar } from "./Navbar";

const parseLocation = (location: Location): QueryParams =>
  qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

const Wrapper = styled.div`
  display: flex;
  height: calc(100vh - 74px);
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
  height: 100%;
  overflow: auto;
`;

const Main = styled.main`
  height: 100%;
`;

interface EnhancedProps {
  detailEpisodeId?: string;
}

type Props = EnhancedProps;

class PrimaryContent extends React.Component<Props> {
  public handleChangePage = (queryParams: QueryParams, history: History) => (
    selected: number
  ) => {
    syncQueryParams({ currentPage: selected }, queryParams, history);
  };

  public renderRoot = ({
    history,
    location,
    match,
  }: RouteComponentProps<{ feedId?: string }>) => {
    const queryParams = parseLocation(location);
    return (
      <Main>
        <Navbar />
        <Wrapper>
          <Sidebar>
            <FeedSelect
              queryParams={queryParams}
              feedId={match.params.feedId}
              history={history}
            />
            <Favourites />
          </Sidebar>
          <Content>
            <EpisodesLoader
              queryParams={queryParams}
              feedId={match.params.feedId}
            >
              <Scrollable>
                <Episodes
                  handleChangePage={this.handleChangePage(queryParams, history)}
                />
              </Scrollable>
            </EpisodesLoader>
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
      </Main>
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

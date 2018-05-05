import React from "react";
import { connect } from "react-redux";
import {
  getFetchStatus,
  getLoadedEpisodes
} from "../modules/episodes/selectors";
import { RootState } from "../modules/reducers";
import { RemoteEpisode } from "../types/episode";

import { FetchStatus } from "../modules/remoteData";
import Episode from "./Episode";

interface DataProps {
  remoteEpisodes: RemoteEpisode[];
  fetchStatus: FetchStatus;
}

type Props = DataProps;

export class Episodes extends React.PureComponent<Props> {
  public render() {
    return (
      <div>
        {this.props.fetchStatus === "LOADING" && <div>Loading...</div>}
        {this.props.fetchStatus === "SUCCESS" &&
          this.props.remoteEpisodes.length === 0 && <div>No results.</div>}
        {this.props.remoteEpisodes.map(remoteEpisode => (
          <div key={remoteEpisode.key}>
            <Episode episodeId={remoteEpisode.id} />
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): DataProps => {
  const remoteEpisodes = getLoadedEpisodes(state);
  const fetchStatus = getFetchStatus(state);
  return {
    remoteEpisodes,
    fetchStatus
  };
};

export default connect(mapStateToProps)(Episodes);

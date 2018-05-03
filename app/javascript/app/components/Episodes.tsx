import React from "react";
import { connect } from "react-redux";
import { getLoadedEpisodes } from "../modules/episodes/selectors";
import { RootState } from "../modules/reducers";
import { RemoteEpisode } from "../types/episode";

import Episode from "./Episode";

interface DataProps {
  remoteEpisodes: RemoteEpisode[];
}

type Props = DataProps;

export class Episodes extends React.PureComponent<Props> {
  public render() {
    return (
      <div>
        {this.props.remoteEpisodes.map(remoteEpisode => (
          <div key={remoteEpisode.key}>
            <Episode {...remoteEpisode} />
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): DataProps => {
  const remoteEpisodes = Object.values(getLoadedEpisodes(state));
  return {
    remoteEpisodes
  };
};

export default connect(mapStateToProps)(Episodes);

import React from "react";
import { connect } from "react-redux";
import * as shortid from "shortid";
import { getEpisodes } from "../modules/episodes/selectors";
import { RootState } from "../modules/reducers";
import { RemoteData } from "../modules/remoteData";
import { RemoteEpisode } from "../types/episode";

import { Episode } from "./Episode";

type RemoteDataWithKey<D> = RemoteData<D> & {
  key: string;
};

interface DataProps {
  remoteEpisodes: Array<RemoteDataWithKey<RemoteEpisode>>;
}

interface PropsExtended {
  feedId: number;
}

type Props = DataProps & PropsExtended;

export class Episodes extends React.PureComponent<Props> {
  public render() {
    return (
      <div>
        {this.props.remoteEpisodes.map(remoteEpisode => (
          <div key={remoteEpisode.key}>
            {remoteEpisode.type === "SUCCESS" && (
              <Episode {...remoteEpisode.data} />
            )}
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): DataProps => {
  const remoteEpisodes = Object.values(getEpisodes(state));
  return {
    remoteEpisodes: remoteEpisodes.map(remoteEpisode => ({
      ...remoteEpisode,
      key: shortid.generate()
    }))
  };
};

export default connect(mapStateToProps)(Episodes);

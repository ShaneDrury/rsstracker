import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import * as shortid from "shortid";
import { EpisodesAction, fetchEpisodes } from "../modules/episodes/actions";
import { getEpisodes } from "../modules/episodes/selectors";
import { Filter } from "../modules/filters";
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

interface DispatchProps {
  fetchEpisodes: () => void;
}

interface PropsExtended {
  filter: Filter;
  feedId: number;
}

type Props = DataProps & DispatchProps & PropsExtended;

export class Episodes extends React.PureComponent<Props> {
  public componentDidMount() {
    this.props.fetchEpisodes();
  }

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

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>,
  { filter, feedId }: PropsExtended
): DispatchProps =>
  bindActionCreators(
    {
      fetchEpisodes: fetchEpisodes(filter, feedId)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Episodes);

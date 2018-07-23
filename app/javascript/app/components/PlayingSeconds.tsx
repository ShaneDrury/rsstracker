import * as moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { getPlayedSeconds } from "../modules/player/selectors";
import { RootState } from "../modules/reducers";

interface DataProps {
  episodeId: string;
}

interface PropsExtended {
  playingSeconds?: number;
}

type Props = DataProps & PropsExtended;

export const PlayingSeconds: React.SFC<Props> = ({ playingSeconds }) => {
  if (!playingSeconds) {
    return null;
  }
  return (
    <span>
      Played: {moment.duration(playingSeconds, "seconds").humanize()}
      {" - "}
    </span>
  );
};

const mapStateToProps = (
  state: RootState,
  ownProps: DataProps
): PropsExtended => {
  const playingSeconds = getPlayedSeconds(state)[ownProps.episodeId];
  return {
    playingSeconds,
  };
};

export default connect(mapStateToProps)(PlayingSeconds);

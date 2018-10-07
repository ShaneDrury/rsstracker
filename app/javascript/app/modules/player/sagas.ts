import { all, take } from "redux-saga/effects";
import { actions, PlayedSecondsUpdated, PlayToggled } from "./actions";

function savePlayedSeconds(episodeId: string, playedSeconds: number) {
  const savedSecondsJSON = localStorage.getItem("savedSeconds");
  const savedSeconds: { [episodeId: string]: number } =
    savedSecondsJSON && JSON.parse(savedSecondsJSON);
  savedSeconds[episodeId] = playedSeconds;
  localStorage.setItem("savedSeconds", JSON.stringify(savedSeconds));
}

function* watchPlayedSeconds() {
  while (true) {
    const {
      payload: { episodeId, playedSeconds },
    }: PlayedSecondsUpdated = yield take(actions.PLAYED_SECONDS_UPDATED);
    savePlayedSeconds(episodeId, playedSeconds);
  }
}

function savePlayingEpisode(playingEpisodeId: string) {
  localStorage.setItem("lastPlayedEpisode", JSON.stringify(playingEpisodeId));
}

function* watchPlayToggled() {
  while (true) {
    const {
      payload: { playingEpisodeId },
    }: PlayToggled = yield take(actions.PLAY_TOGGLED);
    savePlayingEpisode(playingEpisodeId);
  }
}

export default function* playerSagas() {
  yield all([watchPlayedSeconds(), watchPlayToggled()]);
}

import { all } from "redux-saga/effects";
import episodesSagas from "./episodes/sagas";
import { watchUpdateEpisodeComplete } from "./feeds/sagas";
import jobsSagas from "./jobs/sagas";

export default function* rootSaga() {
  yield all([watchUpdateEpisodeComplete(), jobsSagas(), episodesSagas()]);
}

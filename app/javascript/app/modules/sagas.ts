import { all } from "redux-saga/effects";
import episodeJobsSagas from "./episodeJobs/sagas";
import episodesSagas from "./episodes/sagas";
import feedJobsSagas from "./feedJobs/sagas";
import feedsSagas from "./feeds/sagas";
import jobsSagas from "./jobs/sagas";
import playerSagas from "./player/sagas";

export default function* rootSaga() {
  yield all([
    feedsSagas(),
    jobsSagas(),
    episodesSagas(),
    episodeJobsSagas(),
    playerSagas(),
    feedJobsSagas(),
  ]);
}

import { all } from "redux-saga/effects";
import { watchUpdateEpisodeComplete } from "./feeds/sagas";
import jobsSagas from "./jobs/sagas";

export default function* rootSaga() {
  yield all([watchUpdateEpisodeComplete(), jobsSagas()]);
}

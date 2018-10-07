import { all } from "redux-saga/effects";
import episodesSagas from "./episodes/sagas";
import feedsSagas from "./feeds/sagas";
import jobsSagas from "./jobs/sagas";

export default function* rootSaga() {
  yield all([feedsSagas(), jobsSagas(), episodesSagas()]);
}

import { all } from "redux-saga/effects";
import { watchUpdateEpisodeComplete } from "./feeds/sagas";

export default function* rootSaga() {
  yield all([watchUpdateEpisodeComplete()]);
}

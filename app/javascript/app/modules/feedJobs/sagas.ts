import { all, takeEvery } from "redux-saga/effects";
import { updateFeeds } from "../feeds/sources";
import { feedJobsActions, UpdateFeedsRequested } from "./actions";

function* updateFeedsSaga({  }: UpdateFeedsRequested) {
  yield updateFeeds();
}

function* watchUpdateFeedsRequested() {
  yield takeEvery(feedJobsActions.UPDATE_FEEDS_REQUESTED, updateFeedsSaga);
}

export default function* feedJobsSagas() {
  yield all([watchUpdateFeedsRequested()]);
}

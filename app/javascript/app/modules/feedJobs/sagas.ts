import { zipObject } from "lodash";
import { all, put, takeEvery } from "redux-saga/effects";
import { updateFeeds, UpdateFeedsResponse } from "../feeds/sources";
import { processJobResponse } from "../jobs/sources";
import {
  feedJobsActions,
  UpdateFeedsRequested,
  updateFeedsStarted,
} from "./actions";

function* updateFeedsSaga({ payload: { feedIds } }: UpdateFeedsRequested) {
  const updateResponse: UpdateFeedsResponse = yield updateFeeds(feedIds);
  const jobs = updateResponse.jobs.map(processJobResponse);
  const feedsToJobs = zipObject(feedIds, jobs);
  yield put(updateFeedsStarted(feedsToJobs));
}

function* watchUpdateFeedsRequested() {
  yield takeEvery(feedJobsActions.UPDATE_FEEDS_REQUESTED, updateFeedsSaga);
}

export default function* feedJobsSagas() {
  yield all([watchUpdateFeedsRequested()]);
}

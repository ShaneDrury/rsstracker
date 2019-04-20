import { zipObject } from "lodash";
import { all, put, takeEvery } from "redux-saga/effects";
import { updateFeeds, UpdateFeedsResponse } from "../feeds/sources";
import { processJobResponse } from "../jobs/sources";
import {
  feedJobsActions,
  UpdateFeedsRequested,
  updateFeedsStarted,
} from "./actions";

function* updateFeedsSaga({  }: UpdateFeedsRequested) {
  const updateResponse: UpdateFeedsResponse = yield updateFeeds();
  const jobs = updateResponse.jobs.data.map(processJobResponse);
  const sourceIds = jobs.map(job => job.arguments[0]);
  const sourcesToJobs = zipObject(sourceIds, jobs);
  yield put(updateFeedsStarted(sourcesToJobs));
}

function* watchUpdateFeedsRequested() {
  yield takeEvery(feedJobsActions.UPDATE_FEEDS_REQUESTED, updateFeedsSaga);
}

export default function* feedJobsSagas() {
  yield all([watchUpdateFeedsRequested()]);
}

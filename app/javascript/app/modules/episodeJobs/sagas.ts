import { all, put, take } from "redux-saga/effects";
import {
  downloadEpisode,
  DownloadEpisodeResponse,
  redownloadEpisode,
} from "../episodes/sources";
import { processJobResponse } from "../jobs/sources";
import {
  DownloadEpisodeRequested,
  downloadEpisodeStarted,
  episodeJobsActions,
} from "./actions";

// TODO: When we get a new episodeJob, check if we have it already in local
// if not dispatch fetch action

function* downloadEpisodeSaga() {
  const {
    payload: { episodeId },
  }: DownloadEpisodeRequested = yield take(
    episodeJobsActions.DOWNLOAD_EPISODE_REQUESTED
  );
  const downloadResponse: DownloadEpisodeResponse = yield downloadEpisode(
    episodeId
  );
  const job = processJobResponse(downloadResponse.data);
  yield put(downloadEpisodeStarted(job, episodeId));
}

function* redownloadEpisodeSaga() {
  const {
    payload: { episodeId },
  }: DownloadEpisodeRequested = yield take(
    episodeJobsActions.REDOWNLOAD_EPISODE_REQUESTED
  );
  const downloadResponse: DownloadEpisodeResponse = yield redownloadEpisode(
    episodeId
  );
  const job = processJobResponse(downloadResponse.data);
  yield put(downloadEpisodeStarted(job, episodeId));
}

export default function* episodeJobsSagas() {
  yield all([downloadEpisodeSaga(), redownloadEpisodeSaga()]);
}

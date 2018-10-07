import { put, takeEvery } from "redux-saga/effects";
import { downloadEpisode } from "../episodes/sources";
import { processJobResponse } from "../jobs/sources";
import {
  DownloadEpisodeRequested,
  downloadEpisodeStarted,
  episodeJobsActions,
} from "./actions";

function* downloadEpisodeSaga({
  payload: { episodeId },
}: DownloadEpisodeRequested) {
  const downloadResponse = yield downloadEpisode(episodeId);
  const job = processJobResponse(downloadResponse.job);
  yield put(downloadEpisodeStarted(job, episodeId));
}

export default function* episodeJobsSagas() {
  yield takeEvery(
    episodeJobsActions.DOWNLOAD_EPISODE_REQUESTED,
    downloadEpisodeSaga
  );
}

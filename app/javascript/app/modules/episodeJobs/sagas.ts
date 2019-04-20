import { put, takeEvery } from "redux-saga/effects";
import { downloadEpisode, DownloadEpisodeResponse } from "../episodes/sources";
import { processJobResponse } from "../jobs/sources";
import {
  DownloadEpisodeRequested,
  downloadEpisodeStarted,
  episodeJobsActions,
} from "./actions";

function* downloadEpisodeSaga({
  payload: { episodeId },
}: DownloadEpisodeRequested) {
  const downloadResponse: DownloadEpisodeResponse = yield downloadEpisode(
    episodeId
  );
  const job = processJobResponse(downloadResponse.data);
  yield put(downloadEpisodeStarted(job, episodeId));
}

export default function* episodeJobsSagas() {
  yield takeEvery(
    episodeJobsActions.DOWNLOAD_EPISODE_REQUESTED,
    downloadEpisodeSaga
  );
}

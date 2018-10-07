import { fork, put, take } from "redux-saga/effects";
import { downloadEpisode } from "../episodes/sources";
import { processJobResponse } from "../jobs/sources";
import {
  DownloadEpisodeRequested,
  downloadEpisodeStarted,
  episodeJobsActions,
} from "./actions";

function* downloadEpisodeSaga(episodeId: string) {
  const downloadResponse = yield downloadEpisode(episodeId);
  const job = processJobResponse(downloadResponse.job);
  yield put(downloadEpisodeStarted(job, episodeId));
}

export default function* episodeJobsSagas() {
  while (true) {
    const {
      payload: { episodeId },
    }: DownloadEpisodeRequested = yield take(
      episodeJobsActions.DOWNLOAD_EPISODE_REQUESTED
    );
    yield fork(downloadEpisodeSaga, episodeId);
  }
}

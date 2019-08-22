import {
  faDownload,
  faPlay,
  faStop,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React from "react";
import { Icon } from "./Icon";
import { FetchStatus } from "../modules/fetchStatus";

interface Props {
  playing: boolean;
  fetchStatus: FetchStatus;
  isUpdating: boolean;
  handleToggleShow: () => void;
  handleDownload: () => void;
  handleRedownload: () => void;
}

export const EpisodeControl: React.FunctionComponent<Props> = ({
  playing,
  fetchStatus,
  isUpdating,
  handleToggleShow,
  handleDownload,
  handleRedownload,
}) => {
  return (
    <div>
      {fetchStatus.status === "SUCCESS" && (
        <div className="buttons has-addons">
          <button
            className={classNames("button", {
              "is-link": !playing,
              "is-danger": playing,
            })}
            onClick={handleToggleShow}
          >
            <span className="icon">
              {playing ? <Icon icon={faStop} /> : <Icon icon={faPlay} />}
            </span>
            <span>{playing ? "Stop" : "Play"}</span>
          </button>
          <button
            className="button is-primary"
            onClick={handleRedownload}
            disabled={isUpdating}
          >
            <span className="icon">
              <span className="icon">
                {isUpdating ? (
                  <Icon icon={faSync} spin />
                ) : (
                  <Icon icon={faDownload} />
                )}
              </span>
            </span>
          </button>
        </div>
      )}
      {!(fetchStatus.status === "SUCCESS") &&
        ((fetchStatus.status === "NOT_ASKED" ||
          fetchStatus.status === "FAILURE" ||
          isUpdating) && (
          <button
            className="button is-primary"
            onClick={handleDownload}
            disabled={isUpdating}
          >
            <span className="icon">
              {isUpdating ? (
                <Icon icon={faSync} spin />
              ) : (
                <Icon icon={faDownload} />
              )}
            </span>
            <span>Download</span>
          </button>
        ))}
    </div>
  );
};

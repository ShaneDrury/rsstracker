import {
  faDownload,
  faInfoCircle,
  faPlay,
  faStop,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React from "react";
import styled from "styled-components";
import { FetchStatus } from "../../modules/fetchStatus";
import { Icon } from "../Icon";

interface EpisodeFooterProps {
  handleDetailOpened: () => void;
  handleToggleShow: () => void;
  handleDownload: () => void;
  fetchStatus: FetchStatus;
  playing: boolean;
  isUpdating: boolean;
  isDetailOpen: boolean;
}

const InfoWrapper = styled.div`
  margin-left: auto;
`;

class EpisodeFooter extends React.PureComponent<EpisodeFooterProps> {
  public render() {
    const { fetchStatus } = this.props;
    return (
      <React.Fragment>
        {fetchStatus.status === "SUCCESS" && (
          <button
            className={classNames("button", {
              "is-link": !this.props.playing,
              "is-danger": this.props.playing,
            })}
            onClick={this.props.handleToggleShow}
          >
            <span className="icon">
              {this.props.playing ? (
                <Icon icon={faStop} />
              ) : (
                <Icon icon={faPlay} />
              )}
            </span>
            <span>{this.props.playing ? "Stop" : "Play"}</span>
          </button>
        )}
        {!(fetchStatus.status === "SUCCESS") && (
          <div>
            {(fetchStatus.status === "NOT_ASKED" ||
              fetchStatus.status === "FAILURE" ||
              this.props.isUpdating) && (
              <button
                className="button is-primary"
                onClick={this.props.handleDownload}
                disabled={this.props.isUpdating}
              >
                <span className="icon">
                  {this.props.isUpdating ? (
                    <Icon icon={faSync} spin />
                  ) : (
                    <Icon icon={faDownload} />
                  )}
                </span>
                <span>Download</span>
              </button>
            )}
          </div>
        )}
        <InfoWrapper>
          <button
            className={classNames("button", {
              "is-static": this.props.isDetailOpen,
            })}
            onClick={this.props.handleDetailOpened}
          >
            <span className="icon">
              <Icon icon={faInfoCircle} />
            </span>
            <span>Info</span>
          </button>
        </InfoWrapper>
      </React.Fragment>
    );
  }
}

export default EpisodeFooter;

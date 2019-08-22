import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React from "react";
import styled from "styled-components";
import { FetchStatus } from "../../modules/fetchStatus";
import { Icon } from "../Icon";
import { EpisodeControl } from "../EpisodeControl";

interface EpisodeFooterProps {
  handleDetailOpened: () => void;
  handleToggleShow: () => void;
  handleDownload: () => void;
  handleRedownload: () => void;
  fetchStatus: FetchStatus;
  playing: boolean;
  isUpdating: boolean;
  isDetailOpen: boolean;
  seen: boolean;
}

const InfoWrapper = styled.div`
  margin-left: auto;
`;

class EpisodeFooter extends React.PureComponent<EpisodeFooterProps> {
  public render() {
    const { fetchStatus } = this.props;
    return (
      <React.Fragment>
        <EpisodeControl
          playing={this.props.playing}
          fetchStatus={fetchStatus}
          isUpdating={this.props.isUpdating}
          handleToggleShow={this.props.handleToggleShow}
          handleDownload={this.props.handleDownload}
          handleRedownload={this.props.handleRedownload}
        />
        {!this.props.seen && <span className="tag">NEW</span>}
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

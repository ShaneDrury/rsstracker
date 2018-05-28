import { FontAwesomeIcon, Props } from "@fortawesome/react-fontawesome";
import React from "react";

export class Icon extends React.PureComponent<Props> {
  public render() {
    return <FontAwesomeIcon {...this.props} />;
  }
}

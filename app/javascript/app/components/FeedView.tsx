import React from "react";
import Episodes from "./Episodes";

interface DataProps {
  sidePanel: JSX.Element;
}

type Props = DataProps;

export class FeedView extends React.Component<Props> {
  public render() {
    return (
      <div className="columns">
        <div className="column is-one-quarter">{this.props.sidePanel}</div>
        <div className="column">
          <Episodes />
        </div>
      </div>
    );
  }
}

export default FeedView;

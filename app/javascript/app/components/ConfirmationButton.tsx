import * as classNames from "classnames";
import React from "react";

interface Props {
  extraClass: string;
  name: string;
}

class ConfirmationButton extends React.Component<Props> {
  public handleClick = (event: React.FormEvent<HTMLInputElement>) => {
    if (!confirm("Are you sure?")) {
      event.preventDefault();
    }
  };

  public render() {
    return (
      <input
        className={classNames("button", this.props.extraClass)}
        type="submit"
        value={this.props.name}
        onClick={this.handleClick}
      />
    );
  }
}

export default ConfirmationButton;

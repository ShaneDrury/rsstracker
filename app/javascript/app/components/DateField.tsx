import * as moment from "moment";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { saveDate } from "../modules/episodes/actions";

interface DataProps {
  episodeId: string;
  date: string;
}

interface DispatchProps {
  saveDate: (episodeId: string, date: string) => void;
}

type Props = DataProps & DispatchProps;

interface State {
  editMode: boolean;
  pendingChanges: string;
}

export class DateField extends React.PureComponent<Props, State> {
  public state = {
    editMode: false,
    pendingChanges: moment(this.props.date).format("YYYY-MM-DD"),
  };

  public editModeOn = () => {
    this.setState({ editMode: true });
  };

  public cancelEditing = () => {
    this.setState({ editMode: false });
  };

  public handleSave = () => {
    this.props.saveDate(this.props.episodeId, this.state.pendingChanges);
    this.setState({ editMode: false });
  };

  public handleEdit: React.ChangeEventHandler<HTMLInputElement> = event => {
    this.setState({ pendingChanges: event.target.value });
  };

  public clearEdits = () => {
    this.setState({ pendingChanges: this.props.date });
  };

  public render() {
    if (!this.state.editMode) {
      return (
        <span onClick={this.editModeOn}>
          {moment(this.props.date).format("ll")}
        </span>
      );
    }
    return (
      <span>
        <input
          autoFocus
          onChange={this.handleEdit}
          onBlur={this.cancelEditing}
          type="date"
          value={this.state.pendingChanges}
        />
        <a className="button is-primary" onMouseDown={this.handleSave}>
          Save
        </a>
      </span>
    );
  }
}

const mapDispatchToProps = {
  saveDate,
};

export default connect(
  undefined,
  mapDispatchToProps
)(DateField);

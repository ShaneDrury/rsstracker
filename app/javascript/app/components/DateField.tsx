import * as moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { saveDate } from "../modules/episodes/actions";
import { EditMode, EditModeOff, EditModeOn } from "./EditMode";

interface DataProps {
  episodeId: string;
  date: string;
}

interface DispatchProps {
  saveDate: (episodeId: string, date: string) => void;
}

type Props = DataProps & DispatchProps;

export class DateField extends React.PureComponent<Props> {
  public handleSave = (changes: string) => {
    this.props.saveDate(this.props.episodeId, changes);
  };

  public editModeOff: EditModeOff = ({ value, startEditing }) => (
    <span onClick={startEditing}>{moment(value).format("ll")}</span>
  );

  public editModeOn: EditModeOn = ({ value, onEdit, onCancel, onSave }) => (
    <span>
      <input
        autoFocus
        onChange={onEdit}
        onBlur={onCancel}
        type="date"
        value={value}
      />
      <a className="button is-primary" onMouseDown={onSave}>
        Save
      </a>
    </span>
  );

  public render() {
    return (
      <EditMode
        initialValue={moment(this.props.date).format("YYYY-MM-DD")}
        onSave={this.handleSave}
        editModeOff={this.editModeOff}
        editModeOn={this.editModeOn}
      />
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

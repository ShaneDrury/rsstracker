import format from "date-fns/format";
import React from "react";
import { connect } from "react-redux";
import { updateEpisodeRequested } from "../modules/episodes/actions";
import { EditMode, EditModeOff, EditModeOn } from "./EditMode";
import { parseISO } from "date-fns";

interface DataProps {
  episodeId: string;
  date: string;
}

interface DispatchProps {
  updateEpisodeRequested: (
    episodeId: string,
    changes: { publicationDate: string }
  ) => void;
}

type Props = DataProps & DispatchProps;

export class DateField extends React.PureComponent<Props> {
  public handleSave = (publicationDate: string) => {
    this.props.updateEpisodeRequested(this.props.episodeId, {
      publicationDate,
    });
  };

  public editModeOff: EditModeOff = ({ value, startEditing }) => (
    <span onClick={startEditing}>{format(parseISO(value), "LLL do yyyy")}</span>
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
        initialValue={format(parseISO(this.props.date), "yyyy-LL-dd")}
        onSave={this.handleSave}
        editModeOff={this.editModeOff}
        editModeOn={this.editModeOn}
      />
    );
  }
}

const mapDispatchToProps = {
  updateEpisodeRequested,
};

export default connect(
  undefined,
  mapDispatchToProps
)(DateField);

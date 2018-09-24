import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { saveDescription } from "../modules/episodes/actions";
import { EditMode, EditModeOff, EditModeOn } from "./EditMode";

interface DataProps {
  episodeId: string;
  text: string;
}

interface DispatchProps {
  saveDescription: (episodeId: string, description: string) => void;
}

type Props = DataProps & DispatchProps;

const TextArea = styled.div`
  cursor: pointer;
  white-space: pre-line;
`;

export class Description extends React.PureComponent<Props> {
  public handleSave = (changes: string) => {
    this.props.saveDescription(this.props.episodeId, changes);
  };

  public editModeOff: EditModeOff = ({ value, startEditing }) => (
    <article className="message">
      <div className="message-body">
        <TextArea onClick={startEditing}>{value}</TextArea>
      </div>
    </article>
  );

  public editModeOn: EditModeOn = ({
    value,
    onEdit,
    onCancel,
    onSave,
    onClear,
  }) => (
    <div>
      <div className="field">
        <div className="control">
          <textarea
            autoFocus
            className="textarea"
            value={value}
            onChange={onEdit}
            rows={15}
            onBlur={onCancel}
          />
        </div>
      </div>
      <div className="field is-grouped">
        <p className="control">
          <a className="button is-primary" onMouseDown={onSave}>
            Save
          </a>
        </p>
        <p className="control">
          <a className="button is-danger" onMouseDown={onClear}>
            Clear
          </a>
        </p>
      </div>
    </div>
  );

  public render() {
    return (
      <EditMode
        initialValue={this.props.text}
        onSave={this.handleSave}
        editModeOff={this.editModeOff}
        editModeOn={this.editModeOn}
      />
    );
  }
}

const mapDispatchToProps = {
  saveDescription,
};

export default connect(
  undefined,
  mapDispatchToProps
)(Description);

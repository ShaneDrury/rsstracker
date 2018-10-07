import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { updateEpisodeRequested } from "../modules/episodes/actions";
import { EditMode, EditModeOff, EditModeOn } from "./EditMode";

interface DataProps {
  episodeId: string;
  text: string;
}

interface DispatchProps {
  updateEpisodeRequested: (
    episodeId: string,
    changes: { description: string }
  ) => void;
}

type Props = DataProps & DispatchProps;

const TextArea = styled.div`
  cursor: pointer;
  white-space: pre-line;
`;

export class Description extends React.PureComponent<Props> {
  public handleSave = (description: string) => {
    this.props.updateEpisodeRequested(this.props.episodeId, { description });
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
  updateEpisodeRequested,
};

export default connect(
  undefined,
  mapDispatchToProps
)(Description);

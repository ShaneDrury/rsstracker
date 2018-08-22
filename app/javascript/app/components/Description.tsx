import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { saveDescription } from "../modules/episodes/actions";

interface DataProps {
  episodeId: string;
  text: string;
}

interface DispatchProps {
  saveDescription: (episodeId: string, description: string) => void;
}

type Props = DataProps & DispatchProps;

interface State {
  editMode: boolean;
  pendingChanges: string;
}

const TextArea = styled.div`
  cursor: pointer;
  white-space: pre-line;
`;

export class Description extends React.PureComponent<Props, State> {
  public state = {
    editMode: false,
    pendingChanges: this.props.text,
  };

  public editModeOn = () => {
    this.setState({ editMode: true });
  };

  public cancelEditing = () => {
    this.setState({ editMode: false });
  };

  public handleSave = () => {
    this.props.saveDescription(this.props.episodeId, this.state.pendingChanges);
    this.setState({ editMode: false });
  };

  public handleEdit: React.ChangeEventHandler<HTMLTextAreaElement> = event => {
    this.setState({ pendingChanges: event.target.value });
  };

  public clearEdits = () => {
    this.setState({ pendingChanges: this.props.text });
  };

  public render() {
    const { text } = this.props;
    return (
      <div>
        {!this.state.editMode && (
          <article className="message">
            <div className="message-body">
              <TextArea onClick={this.editModeOn}>{text}</TextArea>
            </div>
          </article>
        )}
        {this.state.editMode && (
          <div>
            <div className="field">
              <div className="control">
                <textarea
                  autoFocus
                  className="textarea"
                  value={this.state.pendingChanges}
                  onChange={this.handleEdit}
                  rows={15}
                  onBlur={this.cancelEditing}
                />
              </div>
            </div>
            <div className="field is-grouped">
              <p className="control">
                <a className="button is-primary" onMouseDown={this.handleSave}>
                  Save
                </a>
              </p>
              <p className="control">
                <a className="button is-danger" onMouseDown={this.clearEdits}>
                  Clear
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
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

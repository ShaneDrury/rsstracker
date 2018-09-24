import React from "react";

type InputElement = HTMLTextAreaElement | HTMLInputElement;

export type EditModeOn = (
  args: {
    value: string;
    onEdit: React.ChangeEventHandler<InputElement>;
    onCancel: () => void;
    onSave: () => void;
    onClear: () => void;
  }
) => JSX.Element;

export type EditModeOff = (
  args: { value: string; startEditing: () => void }
) => JSX.Element;

interface Props {
  initialValue: string;
  onSave: (changes: string) => void;
  editModeOff: EditModeOff;
  editModeOn: EditModeOn;
}

interface State {
  editMode: boolean;
  pendingChanges: string;
}

export class EditMode extends React.PureComponent<Props, State> {
  public state = {
    editMode: false,
    pendingChanges: this.props.initialValue,
  };

  public startEditing = () => {
    this.setState({ editMode: true });
  };

  public cancelEditing = () => {
    this.setState({ editMode: false });
  };

  public handleSave = () => {
    this.setState({ editMode: false });
    this.props.onSave(this.state.pendingChanges);
  };

  public handleEdit: React.ChangeEventHandler<InputElement> = event => {
    this.setState({ pendingChanges: event.target.value });
  };

  public clearEdits = () => {
    this.setState({ pendingChanges: this.props.initialValue });
  };

  public render() {
    if (!this.state.editMode) {
      return this.props.editModeOff({
        value: this.props.initialValue,
        startEditing: this.startEditing,
      });
    }
    return this.props.editModeOn({
      value: this.state.pendingChanges,
      onEdit: this.handleEdit,
      onCancel: this.cancelEditing,
      onSave: this.handleSave,
      onClear: this.clearEdits,
    });
  }
}

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EpisodesAction, saveDescription } from "../modules/episodes/actions";
import { getEpisodes } from "../modules/episodes/selectors";
import { RootState } from "../modules/reducers";
import { Dispatch } from "../types/thunk";

interface DataProps {
  episodeId: string;
}

interface PropsExtended {
  text: string;
}

interface DispatchProps {
  saveDescription: (episodeId: string, description: string) => void;
}

type Props = DataProps & PropsExtended & DispatchProps;

interface State {
  editMode: boolean;
  pendingChanges: string;
}

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
          <div onClick={this.editModeOn} style={{ cursor: "pointer" }}>
            {text.split("\n").map((item, key) => (
              <span key={key}>
                {item}
                <br />
              </span>
            ))}
          </div>
        )}
        {this.state.editMode && (
          <div>
            <div className="field">
              <div className="control">
                <textarea
                  className="textarea"
                  value={this.state.pendingChanges}
                  onChange={this.handleEdit}
                  rows={15}
                />
              </div>
            </div>
            <div className="field is-grouped">
              <p className="control">
                <a className="button is-primary" onClick={this.handleSave}>
                  Save
                </a>
              </p>
              <p className="control">
                <a className="button is-warning" onClick={this.cancelEditing}>
                  Cancel
                </a>
              </p>
              <p className="control">
                <a className="button is-danger" onClick={this.clearEdits}>
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

const mapStateToProps = (
  state: RootState,
  ownProps: DataProps
): PropsExtended => {
  const episode = getEpisodes(state)[ownProps.episodeId];
  return {
    text: episode.description,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<EpisodesAction, RootState>
): DispatchProps =>
  bindActionCreators(
    {
      saveDescription,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Description);

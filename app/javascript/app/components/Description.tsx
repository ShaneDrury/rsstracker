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
          <div>
            {text.split("\n").map((item, key) => (
              <span key={key}>
                {item}
                <br />
              </span>
            ))}
            <button onClick={this.editModeOn}>Edit</button>
          </div>
        )}
        {this.state.editMode && (
          <div>
            <textarea
              value={this.state.pendingChanges}
              onChange={this.handleEdit}
            />
            <button onClick={this.handleSave}>Save</button>
            <button onClick={this.cancelEditing}>Cancel</button>
            <button onClick={this.clearEdits}>Clear</button>
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

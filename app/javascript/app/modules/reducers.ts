import { combineReducers } from "redux";

interface State {

}

const foo = (state: State = {}) => {
  return state;
};

const rootReducer = combineReducers({
  foo,
});

export default rootReducer;

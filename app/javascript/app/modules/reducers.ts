import { combineReducers } from "redux";

type State = any;

const foo = (state: State = {}) => {
  return state;
};

const rootReducer = combineReducers({
  foo
});

export default rootReducer;

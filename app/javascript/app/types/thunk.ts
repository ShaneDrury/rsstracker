import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";

export type Dispatch<A extends Action, S, E = null> = ThunkDispatch<S, E, A>;

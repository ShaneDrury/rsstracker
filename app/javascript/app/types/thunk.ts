import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { RootAction } from "../modules/actions";
import { RootState } from "../modules/reducers";

export type RootThunk<R, O = null> = ThunkAction<R, RootState, O, RootAction>;

export type Dispatch<A extends Action, S, E = null> = ThunkDispatch<S, E, A>;

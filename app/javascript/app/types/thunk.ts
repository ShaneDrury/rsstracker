import { RootAction } from "../modules/actions";
import { RootState } from "../modules/reducers";
import { ThunkAction } from "./redux-thunk";

export type RootThunk<R, O = null> = ThunkAction<R, RootState, RootAction, O>;

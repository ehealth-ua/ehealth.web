import { handleAction, combineActions } from "redux-actions";

export default handleAction(
  combineActions("labels/FETCH_LIST_SUCCESS", "templates/FETCH_LIST_SUCCESS"),
  (state, action) => ({
    ...state,
    ...action.payload.data
  }),
  {}
);

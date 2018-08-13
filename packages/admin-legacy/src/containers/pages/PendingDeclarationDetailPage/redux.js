import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromDeclarations from "../../../redux/declarations";

export const showDeclaration = createAction(
  "pendingDeclarationDetailPage/SHOW_DECLARATION"
);

export const fetchDeclaration = id => dispatch =>
  dispatch(fromDeclarations.fetchDeclaration(id)).then(action => {
    if (action.error) throw action;
    return dispatch(showDeclaration(action.payload.result));
  });

const declaration = handleAction(
  showDeclaration,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  declaration
});

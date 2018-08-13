import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromDeclarations from "../../../redux/declarations";

export const showDeclarations = createAction(
  "pendingDeclarationsListPage/SHOW_DECLARATIONS"
);
export const pagingDeclarations = createAction(
  "pendingDeclarationsListPage/ADD_PAGING"
);

export const fetchDeclarations = options => dispatch =>
  dispatch(fromDeclarations.fetchDeclarations(options)).then(action => {
    if (action.error) throw action;

    return [
      dispatch(showDeclarations(action.payload.result || [])),
      dispatch(pagingDeclarations(action.meta || {}))
    ];
  });

const declarations = handleAction(
  showDeclarations,
  (state, action) => action.payload,
  []
);
const paging = handleAction(
  pagingDeclarations,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  declarations,
  paging
});

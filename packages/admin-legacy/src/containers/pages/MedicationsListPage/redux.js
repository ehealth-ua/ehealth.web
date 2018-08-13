import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromMedications from "../../../redux/medications";

export const showMedications = createAction(
  "medicationsListPage/SHOW_MEDICATIONS"
);
export const pagingMedications = createAction("medicationsListPage/ADD_PAGING");

export const fetchMedications = options => dispatch =>
  dispatch(fromMedications.fetchMedications(options)).then(action => {
    if (action.error && action.payload.status !== 400) {
      throw action;
    }

    return [
      dispatch(showMedications(action.payload.result || [])),
      dispatch(pagingMedications(action.meta || {}))
    ];
  });

const medications = handleAction(
  showMedications,
  (state, action) => action.payload,
  []
);
const paging = handleAction(
  pagingMedications,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  medications,
  paging
});

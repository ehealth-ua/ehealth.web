import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";

import * as fromMedicationRequests from "../../../redux/medication-requests";

export const showMedicationRequest = createAction(
  "medicationRequestDetailPage/SHOW_REQUEST"
);

export const fetchMedicationRequest = id => dispatch =>
  dispatch(fromMedicationRequests.fetchMedicationRequest(id)).then(action => {
    if (action.error) throw action;
    return dispatch(showMedicationRequest(action.payload.result));
  });

const medication_request = handleAction(
  showMedicationRequest,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  medication_request
});

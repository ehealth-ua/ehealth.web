import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";

import * as fromMedicationRequests from "../../../redux/medication-requests";

export const showMedicationRequests = createAction(
  "medicationRequestsListPage/SHOW_REQUESTS"
);

export const pagingMedicationRequests = createAction(
  "medicationRequestsListPage/ADD_PAGING"
);

export const fetchMedicationRequests = options => dispatch =>
  dispatch(fromMedicationRequests.fetchMedicationRequests(options)).then(
    action => {
      if (action.error && action.payload.status !== 400) {
        throw action;
      }

      return [
        dispatch(showMedicationRequests(action.payload.result || [])),
        dispatch(pagingMedicationRequests(action.meta || {}))
      ];
    }
  );

const medication_requests = handleAction(
  showMedicationRequests,
  (state, action) => action.payload,
  []
);

const paging = handleAction(
  pagingMedicationRequests,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  medication_requests,
  paging
});

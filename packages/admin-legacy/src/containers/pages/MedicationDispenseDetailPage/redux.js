import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";

import * as fromMedicationDispenses from "../../../redux/medication-dispenses";

export const showMedicationDispense = createAction(
  "medicationDispenseDetailPage/SHOW_DISPENSE"
);

export const fetchMedicationDispense = id => dispatch =>
  dispatch(fromMedicationDispenses.fetchMedicationDispense(id)).then(action => {
    if (action.error) throw action;
    return dispatch(showMedicationDispense(action.payload.result));
  });

const medication_dispense = handleAction(
  showMedicationDispense,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  medication_dispense
});

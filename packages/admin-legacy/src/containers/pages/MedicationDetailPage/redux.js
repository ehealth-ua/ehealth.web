import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromMedications from "../../../redux/medications";

export const showMedication = createAction(
  "MedicationDetailPage/SHOW_MEDICATION"
);

export const fetchMedication = id => dispatch =>
  dispatch(fromMedications.fetchMedication(id)).then(action => {
    if (action.error) throw action;
    return dispatch(showMedication(action.payload.result));
  });

const medication = handleAction(
  showMedication,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  medication
});

import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromProgramMedications from "../../../redux/program-medications";

export const showProgramMedication = createAction(
  "programMedicationDetailPage/SHOW_PROGRAM_MEDICATION"
);

export const fetchProgramMedication = id => dispatch =>
  dispatch(fromProgramMedications.fetchProgramMedication(id)).then(action => {
    if (action.error) throw action;
    return dispatch(showProgramMedication(action.payload.result));
  });

const program_medication = handleAction(
  showProgramMedication,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  program_medication
});

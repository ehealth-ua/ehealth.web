import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromMedicalProgram from "../../../redux/medical-programs";

export const showMedicalProgram = createAction(
  "medicalProgramsDetailPage/SHOW_MEDICAL_PROGRAM"
);

export const fetchMedicalProgram = id => dispatch =>
  dispatch(fromMedicalProgram.fetchMedicalProgram(id)).then(action => {
    if (action.error && action.payload.status !== 400) {
      throw action;
    }

    return dispatch(showMedicalProgram(action.payload.result || []));
  });

const medical_program = handleAction(
  showMedicalProgram,
  (state, action) => action.payload,
  []
);

export default combineReducers({
  medical_program
});

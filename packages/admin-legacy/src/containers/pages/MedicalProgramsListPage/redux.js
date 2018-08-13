import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromMedicalProgram from "../../../redux/medical-programs";

export const showMedicalProgram = createAction(
  "medicalProgramsListPage/SHOW_MEDICAL_PROGRAMS"
);
export const pagingMedicalPrograms = createAction(
  "medicalProgramsListPage/ADD_PAGING"
);

export const fetchMedicalPrograms = options => dispatch =>
  dispatch(fromMedicalProgram.fetchMedicalPrograms(options)).then(action => {
    if (action.error && action.payload.status !== 400) {
      throw action;
    }

    return [
      dispatch(showMedicalProgram(action.payload.result || [])),
      dispatch(pagingMedicalPrograms(action.meta || {}))
    ];
  });

const medical_programs = handleAction(
  showMedicalProgram,
  (state, action) => action.payload,
  []
);
const paging = handleAction(
  pagingMedicalPrograms,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  medical_programs,
  paging
});

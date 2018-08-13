import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromProgramMedications from "../../../redux/program-medications";

export const showProgramMedications = createAction(
  "programMedicationsListPage/SHOW_PROGRAM_MEDICATIONS"
);
export const pagingProgramMedications = createAction(
  "programMedicationsListPage/ADD_PAGING"
);

export const fetchProgramMedications = options => dispatch =>
  dispatch(fromProgramMedications.fetchProgramMedications(options)).then(
    action => {
      if (action.error && action.payload.status !== 400) {
        throw action;
      }
      return [
        dispatch(showProgramMedications(action.payload.result || [])),
        dispatch(pagingProgramMedications(action.meta || {}))
      ];
    }
  );

const program_medications = handleAction(
  showProgramMedications,
  (state, action) => action.payload,
  []
);
const paging = handleAction(
  pagingProgramMedications,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  program_medications,
  paging
});

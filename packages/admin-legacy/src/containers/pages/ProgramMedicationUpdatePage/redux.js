import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import { push } from "react-router-redux";
import * as fromProgramMedications from "../../../redux/program-medications";

export const showProgramMedication = createAction(
  "programMedicationUpdatePage/SHOW_PROGRAM_MEDICATION"
);

export const fetchProgramMedication = id => dispatch =>
  dispatch(fromProgramMedications.fetchProgramMedication(id)).then(action => {
    if (action.error) throw action;
    return dispatch(showProgramMedication(action.payload.result));
  });

export const onUpdate = (v, id) => dispatch => {
  const values = {
    is_active: v.is_active,
    medication_request_allowed: v.medication_request_allowed,
    reimbursement: {
      type: v.reimbursement.type,
      reimbursement_amount: parseFloat(v.reimbursement.reimbursement_amount, 2)
    }
  };
  dispatch(fromProgramMedications.updateProgramMedication(values, id)).then(
    action => {
      if (action.error) throw action;
      return dispatch(push(`/program-medications/${id}`));
    }
  );
};

const program_medication = handleAction(
  showProgramMedication,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  program_medication
});

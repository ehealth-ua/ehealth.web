import { createAction, combineActions, handleActions } from "redux-actions";

export const dismissError = createAction("error/DISMISS_ERROR");

export default handleActions(
  {
    [combineActions(
      "innms/CREATE_INNM_FAILURE",
      "innm_dosages/CREATE_INNM_DOSAGES_FAILURE",
      "medications/CREATE_FAILURE",
      "medical_programs/CREATE_FAILURE",
      "program_medications/CREATE_FAILURE",
      "black_list_users/CREATE_FAILURE",

      "innm_dosages/DEACTIVATE_INNM_DOSAGES_FAILURE",
      "medications/DEACTIVATE_FAILURE",
      "medical_programs/DEACTIVATE_FAILURE",
      "black_list_users/DEACTIVATE_FAILURE",
      "persons/FETCH_LIST_FAILURE",

      "program_medications/UPDATE_FAILURE",

      "registers/UPLOAD_FAILURE",

      "contracts/UPDATE_CONTRACT_FAILURE",
      "contracts/DECLINE_CONTRACT_FAILURE",
      "contracts/APPROVE_CONTRACT_FAILURE",
      "contracts/SIGN_NHS_CONTRACT_FAILURE"
    )]: (state, action) => action.payload,
    [dismissError]: () => null
  },
  null
);

import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";

import * as fromMedicationDispenses from "../../../redux/medication-dispenses";

export const showMedicationDispenses = createAction(
  "medicationDispensesListPage/SHOW_DISPENSES"
);

export const pagingMedicationDispenses = createAction(
  "medicationDispensesListPage/ADD_PAGING"
);

export const fetchMedicationDispenses = options => dispatch =>
  dispatch(fromMedicationDispenses.fetchMedicationDispenses(options)).then(
    action => {
      if (action.error && action.payload.status !== 400) {
        throw action;
      }

      return [
        dispatch(showMedicationDispenses(action.payload.result || [])),
        dispatch(pagingMedicationDispenses(action.meta || {}))
      ];
    }
  );

const medication_dispenses = handleAction(
  showMedicationDispenses,
  (state, action) => action.payload,
  []
);

const paging = handleAction(
  pagingMedicationDispenses,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  medication_dispenses,
  paging
});

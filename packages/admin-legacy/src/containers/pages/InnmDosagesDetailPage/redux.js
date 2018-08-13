import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromInnmDosages from "../../../redux/innm-dosages";

export const showInnmDosage = createAction(
  "InnmDosageDetailPage/SHOW_INNM_DOSAGES"
);

export const fetchInnmsDosages = id => dispatch =>
  dispatch(fromInnmDosages.fetchInnmDosage(id)).then(action => {
    if (action.error) throw action;
    return dispatch(showInnmDosage(action.payload.result));
  });

const innm_dosage = handleAction(
  showInnmDosage,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  innm_dosage
});

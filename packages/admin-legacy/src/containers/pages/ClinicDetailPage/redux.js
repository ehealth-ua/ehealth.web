import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromClinics from "../../../redux/clinics";

export const showClinic = createAction("clinicDetailPage/SHOW_CLINIC");

export const fetchClinic = id => dispatch =>
  dispatch(fromClinics.fetchClinic(id)).then(action => {
    if (action.error) throw action;
    return dispatch(showClinic(action.payload.result));
  });

const clinic = handleAction(showClinic, (state, action) => action.payload, {});

export default combineReducers({
  clinic
});

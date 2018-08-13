import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromClinics from "../../../redux/clinics";

export const showClinics = createAction("clinicsListPage/SHOW_CLINICS");
export const pagingClinics = createAction("clinicsListPage/ADD_PAGING");

export const fetchClinics = options => dispatch =>
  dispatch(fromClinics.fetchClinics(options)).then(action => {
    if (action.error) throw action;

    return [
      dispatch(showClinics(action.payload.result)),
      dispatch(pagingClinics(action.meta))
    ];
  });

const clinics = handleAction(
  showClinics,
  (state, action) => action.payload,
  []
);
const paging = handleAction(
  pagingClinics,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  clinics,
  paging
});

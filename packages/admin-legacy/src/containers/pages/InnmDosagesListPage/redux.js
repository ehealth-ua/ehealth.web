import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromInnmDosages from "../../../redux/innm-dosages";

export const showInnmDosages = createAction(
  "innmDosagesListPage/SHOW_INNM_DOSAGES"
);
export const pagingInnmDosages = createAction("innmDosagesListPage/ADD_PAGING");

export const fetchInnmDosages = options => dispatch =>
  dispatch(fromInnmDosages.fetchInnmDosages(options)).then(action => {
    if (action.error && action.payload.status !== 400) {
      throw action;
    }

    return [
      dispatch(showInnmDosages(action.payload.result || [])),
      dispatch(pagingInnmDosages(action.meta || {}))
    ];
  });

const innm_dosages = handleAction(
  showInnmDosages,
  (state, action) => action.payload,
  []
);
const paging = handleAction(
  pagingInnmDosages,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  innm_dosages,
  paging
});

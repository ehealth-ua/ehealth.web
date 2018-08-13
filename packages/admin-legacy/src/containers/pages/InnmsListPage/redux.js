import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromInnms from "../../../redux/innms";

export const showInnms = createAction("innmsListPage/SHOW_INMMS");
export const pagingInnms = createAction("innmsListPage/ADD_PAGING");

export const fetchInnms = options => dispatch =>
  dispatch(fromInnms.fetchInnms(options)).then(action => {
    if (action.error && action.payload.status !== 400) {
      throw action;
    }

    return [
      dispatch(showInnms(action.payload.result || [])),
      dispatch(pagingInnms(action.meta || {}))
    ];
  });

const innms = handleAction(showInnms, (state, action) => action.payload, []);
const paging = handleAction(pagingInnms, (state, action) => action.payload, {});

export default combineReducers({
  innms,
  paging
});

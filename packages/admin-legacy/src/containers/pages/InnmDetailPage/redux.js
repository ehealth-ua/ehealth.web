import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromInnms from "../../../redux/innms";

export const showInnm = createAction("innm/SHOW_CONFIGURATION");

export const fetchInnm = id => dispatch =>
  dispatch(fromInnms.fetchInnm(id)).then(action => {
    if (action.error) throw action;
    return dispatch(showInnm(action.payload.result));
  });

const innm = handleAction(showInnm, (state, action) => action.payload, []);

export default combineReducers({
  innm
});

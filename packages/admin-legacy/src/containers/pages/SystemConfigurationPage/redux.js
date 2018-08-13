import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromConfiguration from "../../../redux/configuration";

export const showConfiguration = createAction(
  "systemConfigurationListPage/SHOW_CONFIGURATION"
);

export const fetchConfiguration = () => dispatch =>
  dispatch(fromConfiguration.fetchConfiguration()).then(action => {
    if (action.error) throw action;
    return dispatch(showConfiguration(action.payload.result));
  });

const configuration = handleAction(
  showConfiguration,
  (state, action) => action.payload,
  []
);

export default combineReducers({
  configuration
});

import { createAction, handleAction } from "redux-actions";
import { combineReducers } from "redux";
import uniqFn from "lodash/uniq";

import * as fromUserRoles from "../../../redux/userRoles";
import { REACT_APP_PATIENT_ACCOUNT_CLIENT_ID } from "../../../env";

const setScope = createAction("AcceptPage/SET_SCOPE");

export const fetchScope = clientId => dispatch => {
  if (clientId === REACT_APP_PATIENT_ACCOUNT_CLIENT_ID) {
    return dispatch(setScope("cabinet"));
  } else {
    return dispatch(fromUserRoles.fetchRoles({ client_id: clientId })).then(
      action => {
        if (action.error) {
          return action;
        }
        if (Object.keys(action.payload.entities).length !== 0) {
          const roles = Object.values(action.payload.entities.userRoles);
          const scope = roles.reduce((prev, cur) => `${prev} ${cur.scope}`, "");
          const scopeArr = uniqFn(scope.split(" ").filter(i => i));
          dispatch(setScope(scopeArr.join(" ")));
          return action;
        }

        const scope = "empty_roles";
        return dispatch(setScope(scope));
      }
    );
  }
};

const scope = handleAction(setScope, (state, action) => action.payload, []);

export default combineReducers({
  scope
});

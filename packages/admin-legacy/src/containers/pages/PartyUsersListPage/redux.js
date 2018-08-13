import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromPartyUsers from "../../../redux/party-users";

export const showPartyUsers = createAction(
  "partyUsersPage/SHOW_BLACK_LIST_USERS"
);
export const pagingPartyUsers = createAction("partyUsersPage/ADD_PAGING");

export const fetchPartyUsers = options => dispatch =>
  dispatch(fromPartyUsers.fetchPartyUsers(options)).then(action => {
    if (action.error && action.payload.status !== 400) {
      throw action;
    }
    return [
      dispatch(showPartyUsers(action.payload.result || [])),
      dispatch(pagingPartyUsers(action.meta || {}))
    ];
  });

const partyUsers = handleAction(
  showPartyUsers,
  (state, action) => action.payload,
  []
);
const paging = handleAction(
  pagingPartyUsers,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  partyUsers,
  paging
});

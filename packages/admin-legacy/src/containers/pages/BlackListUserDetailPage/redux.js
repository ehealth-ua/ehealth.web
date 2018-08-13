import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";

import * as fromBlackListUsers from "../../../redux/black-list-users";

export const showBlackListUsers = createAction(
  "blackListUsersDetailPage/SHOW_DETAIL"
);

export const fetchBlackListUser = id => dispatch =>
  dispatch(fromBlackListUsers.fetchBlackListUsers({ id })).then(action => {
    if (action.error) throw action;
    return dispatch(showBlackListUsers(action.payload.result));
  });

const black_list_users = handleAction(
  showBlackListUsers,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  black_list_users
});

import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromBlackListUsers from "../../../redux/black-list-users";

export const showBlackListUsers = createAction(
  "blackListUsersPage/SHOW_BLACK_LIST_USERS"
);
export const pagingBlackListUsers = createAction(
  "blackListUsersPage/ADD_PAGING"
);

export const fetchBlackListUsers = options => dispatch =>
  dispatch(fromBlackListUsers.fetchBlackListUsers(options)).then(action => {
    if (action.error && action.payload.status !== 400) {
      throw action;
    }
    return [
      dispatch(showBlackListUsers(action.payload.result || [])),
      dispatch(pagingBlackListUsers(action.meta || {}))
    ];
  });

const blackListUsers = handleAction(
  showBlackListUsers,
  (state, action) => action.payload,
  []
);
const paging = handleAction(
  pagingBlackListUsers,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  blackListUsers,
  paging
});

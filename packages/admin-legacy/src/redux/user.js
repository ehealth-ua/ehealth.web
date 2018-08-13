import { handleAction, combineActions } from "redux-actions";
import { invoke } from "./api";
import { fetchSessionToken } from "./auth";

export const fetchUserData = token => dispatch =>
  dispatch(fetchSessionToken(token)).then(action => {
    if (action.error) return action;
    if (new Date(action.payload.expires_at * 1000) < new Date()) {
      return {
        ...action,
        error: true
      };
    }
    return dispatch(fetchUser(action.payload.user_id));
  });

export const fetchUser = userId =>
  invoke({
    endpoint: `/api/admin/users/${userId}`,
    method: "GET",
    types: [
      "user/FETCH_USER_REQUEST",
      "user/FETCH_USER_SUCCESS",
      "user/FETCH_USER_FAILURE"
    ]
  });

export const createUserFromRequest = (employeeRequestId, body) =>
  invoke({
    endpoint: `/api/employee_requests/${employeeRequestId}/user`,
    method: "POST",
    types: [
      "user/CREATE_USER_FROM_REQUEST_REQUEST",
      "user/CREATE_USER_FROM_REQUEST_SUCCESS",
      "user/CREATE_USER_FROM_REQUEST_FAILURE"
    ],
    body
  });

export default handleAction(
  combineActions(
    "user/FETCH_USER_SUCCESS",
    "user/CREATE_USER_FROM_REQUEST_SUCCESS"
  ),
  (state, action) => ({
    ...state,
    ...action.payload.data
  }),
  null
);

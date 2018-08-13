import Cookies from "js-cookie";
import { createAction, handleActions } from "redux-actions";

import { invoke } from "./api";

export const verifyToken = token =>
  invoke({
    endpoint: `/api/admin/tokens/${token}/verify`,
    method: "GET",
    types: [
      "session/VERIFY_TOKEN_REQUEST",
      {
        type: "session/VERIFY_TOKEN_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(({ data: { details: { scope } } }) => ({
            authorized: true,
            scope
          }))
      },
      "session/VERIFY_TOKEN_FAILURE"
    ]
  });

export const logout = () =>
  invoke({
    endpoint: "/auth/logout",
    method: "GET",
    types: [
      "session/LOGOUT_REQUEST",
      "session/LOGOUT_SUCCESS",
      "session/LOGOUT_FAILURE"
    ]
  });

export default handleActions(
  {
    "session/VERIFY_TOKEN_SUCCESS": (state, action) => ({
      ...state,
      ...action.payload
    }),
    "session/LOGOUT_SUCCESS": () => ({})
  },
  {}
);

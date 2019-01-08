import { handleActions } from "redux-actions";

import { invoke } from "./api";

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

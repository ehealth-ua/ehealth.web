import { handleAction, combineActions } from "redux-actions";
import { normalize } from "normalizr";

import { REACT_APP_API_URL } from "../env";
import { createUrl } from "../helpers/url";
import { userRole } from "../schemas";

import { invoke } from "./api";

export const fetchRoles = options =>
  invoke({
    endpoint: createUrl(`${REACT_APP_API_URL}/user/roles`, options),
    method: "GET",
    types: [
      "userRoles/FETCH_USER_ROLES_REQUEST",
      {
        type: "userRoles/FETCH_USER_ROLES_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, [userRole]))
      },
      "userRoles/FETCH_USER_ROLES_FAILURE"
    ]
  });

export default handleAction(
  combineActions("userRoles/FETCH_USER_ROLES_SUCCESS"),
  (state, action) => ({
    ...state,
    ...action.payload.entities.userRoles
  }),
  null
);

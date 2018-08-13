import { handleAction, combineActions } from "redux-actions";

import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import { party_user } from "../schemas";
import { invoke } from "./api";

export const fetchPartyUsers = options =>
  invoke({
    endpoint: createUrl(`/api/party_users`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "party_users/FETCH_LIST_REQUEST",
      {
        type: "party_users/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [party_user])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging)
      },
      "party_users/FETCH_LIST_FAILURE"
    ]
  });

export default handleAction(
  combineActions("party_users/FETCH_LIST_SUCCESS"),
  (state, action) => ({
    ...state,
    ...action.payload.entities.party_users
  }),
  {}
);

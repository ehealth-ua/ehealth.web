import { handleAction, combineActions } from "redux-actions";

import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import { register_entry } from "../schemas";
import { invoke } from "./api";

export const fetchRegisterEntries = options =>
  invoke({
    endpoint: createUrl(`/api/registers_entries/`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "register_entries/FETCH_DETAILS_REQUEST",
      {
        type: "register_entries/FETCH_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [register_entry])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging)
      },
      "register_entries/FETCH_DETAILS_FAILURE"
    ]
  });

export default handleAction(
  combineActions("register_entries/FETCH_DETAILS_SUCCESS"),
  (state, action) => ({
    ...state,
    ...action.payload.entities.register_entries,
    ...action.meta
  }),
  {}
);

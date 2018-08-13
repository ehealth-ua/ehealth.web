import { handleAction, combineActions } from "redux-actions";

import { createUrl } from "../helpers/url";
import { invoke } from "./api";

export const fetchConfiguration = options =>
  invoke({
    endpoint: createUrl(`/api/global_parameters`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "dictionaries/FETCH_CONFIGURATION_REQUEST",
      {
        type: "dictionaries/FETCH_CONFIGURATION_SUCCESS",
        payload: (action, state, res) => res.json().then(resp => resp.data)
      },
      "dictionaries/FETCH_CONFIGURATION_FAILURE"
    ]
  });

export const updateConfiguration = body =>
  invoke({
    endpoint: `/api/global_parameters`,
    method: "PUT",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "dictionaries/UPDATE_CONFIGURATION_REQUEST",
      {
        type: "dictionaries/UPDATE_CONFIGURATION_SUCCESS",
        payload: (action, state, res) => res.json().then(resp => resp.data)
      },
      "dictionaries/UPDATE_CONFIGURATION_FAILURE"
    ],
    body
  });

export default handleAction(
  combineActions(
    "dictionaries/FETCH_CONFIGURATION_SUCCESS",
    "dictionaries/UPDATE_CONFIGURATION_SUCCESS"
  ),
  (state, action) => ({
    ...state,
    ...action.payload
  }),
  []
);

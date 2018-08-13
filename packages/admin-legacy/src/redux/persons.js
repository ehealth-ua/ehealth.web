import { createUrl } from "../helpers/url";
import { handleAction } from "redux-actions";
import { person } from "../schemas";
import { normalize } from "normalizr";

import { invoke } from "./api";

export const resetAuthMethod = id =>
  invoke({
    endpoint: createUrl(
      `/api/persons/${id}/actions/reset_authentication_method`
    ),
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "persons/RESET_AUTH_REQUEST",
      "persons/RESET_AUTH_SUCCESS",
      "persons/RESET_AUTH_FAILURE"
    ]
  });

export const fetchPersons = options =>
  invoke({
    endpoint: createUrl(`/api/persons`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "persons/FETCH_LIST_REQUEST",
      {
        type: "persons/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [person])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging)
      },
      {
        type: "persons/FETCH_LIST_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ]
  });

export default handleAction(
  "persons/FETCH_LIST_SUCCESS",
  (state, action) => ({
    ...state,
    ...action.payload.entities.persons,
    ...action.meta
  }),
  {}
);

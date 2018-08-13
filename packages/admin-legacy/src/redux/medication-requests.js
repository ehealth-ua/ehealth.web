import { handleAction, combineActions } from "redux-actions";
import { normalize } from "normalizr";

import { createUrl } from "../helpers/url";
import { medication_request } from "../schemas";
import { invoke } from "./api";

export const fetchMedicationRequests = options =>
  invoke({
    endpoint: createUrl(`/api/medication_requests`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "medication_requests/FETCH_LIST_REQUEST",
      {
        type: "medication_requests/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [medication_request])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging)
      },
      "medication_requests/FETCH_LIST_FAILURE"
    ]
  });

export const fetchMedicationRequest = id =>
  invoke({
    endpoint: createUrl(`/api/medication_requests/${id}`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "medication_requests/FETCH_DETAILS_REQUEST",
      {
        type: "medication_requests/FETCH_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, medication_request))
      },
      "medication_requests/FETCH_DETAILS_FAILURE"
    ]
  });

export default handleAction(
  combineActions(
    "medication_requests/FETCH_LIST_SUCCESS",
    "medication_requests/FETCH_DETAILS_SUCCESS"
  ),
  (state, action) => ({
    ...state,
    ...action.payload.entities.medication_requests,
    ...action.meta
  }),
  {}
);

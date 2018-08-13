import { handleAction, combineActions } from "redux-actions";
import { normalize } from "normalizr";

import { createUrl } from "../helpers/url";
import { medication_dispense } from "../schemas";
import { invoke } from "./api";

export const fetchMedicationDispenses = options =>
  invoke({
    endpoint: createUrl(`/api/medication_dispenses`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "medication_dispenses/FETCH_LIST_REQUEST",
      {
        type: "medication_dispenses/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [medication_dispense])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging)
      },
      "medication_dispenses/FETCH_LIST_FAILURE"
    ]
  });

export const fetchMedicationDispense = id =>
  invoke({
    endpoint: createUrl(`/api/medication_dispenses/${id}`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "medication_dispenses/FETCH_DETAILS_REQUEST",
      {
        type: "medication_dispenses/FETCH_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, medication_dispense))
      },
      "medication_dispenses/FETCH_DETAILS_FAILURE"
    ]
  });

export default handleAction(
  combineActions(
    "medication_dispenses/FETCH_LIST_SUCCESS",
    "medication_dispenses/FETCH_DETAILS_SUCCESS"
  ),
  (state, action) => ({
    ...state,
    ...action.payload.entities.medication_dispenses,
    ...action.meta
  }),
  {}
);

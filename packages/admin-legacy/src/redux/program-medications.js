import { handleAction, combineActions } from "redux-actions";

import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import { program_medication } from "../schemas";
import { invoke } from "./api";

export const fetchProgramMedications = options =>
  invoke({
    endpoint: createUrl(`/api/program_medications`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "program_medications/FETCH_LIST_REQUEST",
      {
        type: "program_medications/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [program_medication])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging)
      },
      "program_medications/FETCH_LIST_FAILURE"
    ]
  });

export const createProgramMedication = body =>
  invoke({
    endpoint: createUrl(`/api/program_medications`),
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "program_medications/CREATE_MEDICAL_PROGRAM_REQUEST",
      "program_medications/CREATE_SUCCESS",
      {
        type: "program_medications/CREATE_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ],
    body
  });

export const updateProgramMedication = (body, id) =>
  invoke({
    endpoint: `/api/program_medications/${id}`,
    method: "PUT",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "program_medications/UPDATE_MEDICAL_PROGRAM_REQUEST",
      "program_medications/UPDATE_SUCCESS",
      {
        type: "program_medications/UPDATE_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ],
    body
  });

export const fetchProgramMedication = id =>
  invoke({
    endpoint: createUrl(`/api/program_medications/${id}`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "program_medications/FETCH_DETAILS_REQUEST",
      {
        type: "program_medications/FETCH_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, program_medication))
      },
      "program_medications/FETCH_DETAILS_FAILURE"
    ]
  });

export default handleAction(
  combineActions(
    "program_medications/FETCH_LIST_SUCCESS",
    "program_medications/FETCH_DETAILS_SUCCESS"
  ),
  (state, action) => ({
    ...state,
    ...action.payload.entities.program_medications,
    ...action.meta
  }),
  {}
);

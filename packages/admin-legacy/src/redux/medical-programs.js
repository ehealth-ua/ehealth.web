import { handleAction, combineActions } from "redux-actions";

import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import { medical_program } from "../schemas";
import { invoke } from "./api";

export const fetchMedicalPrograms = (options, { useCache = false } = {}) =>
  invoke({
    endpoint: createUrl(`/api/medical_programs`, options),
    method: "GET",
    bailout: state => useCache && state.data.medical_programs,
    headers: {
      "content-type": "application/json"
    },
    types: [
      "medical_programs/FETCH_LIST_REQUEST",
      {
        type: "medical_programs/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [medical_program])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging)
      },
      "medical_programs/FETCH_LIST_FAILURE"
    ]
  });

export const createMedicalProgram = body =>
  invoke({
    endpoint: createUrl(`/api/medical_programs`),
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "medical_programs/CREATE_MEDICAL_PROGRAM_REQUEST",
      "medical_programs/CREATE_SUCCESS",
      {
        type: "medical_programs/CREATE_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ],
    body
  });

export const deactivateMedicalProgram = id =>
  invoke({
    endpoint: createUrl(`/api/medical_programs/${id}/actions/deactivate`),
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "medical_programs/DEACTIVATE_REQUEST",
      "medical_programs/DEACTIVATE_SUCCESS",
      {
        type: "medical_programs/DEACTIVATE_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ]
  });

export const fetchMedicalProgram = id =>
  invoke({
    endpoint: createUrl(`/api/medical_programs/${id}`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "medical_programs/FETCH_DETAILS_REQUEST",
      {
        type: "medical_programs/FETCH_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, medical_program))
      },
      "medical_programs/FETCH_DETAILS_FAILURE"
    ]
  });

export default handleAction(
  combineActions(
    "medical_programs/FETCH_LIST_SUCCESS",
    "medical_programs/FETCH_DETAILS_SUCCESS"
  ),
  (state, action) => ({
    ...state,
    ...action.payload.entities.medical_programs,
    ...action.meta
  }),
  {}
);

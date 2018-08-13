import { handleAction, combineActions } from "redux-actions";

import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import { clinic } from "../schemas";
import { invoke } from "./api";

export const fetchClinics = options =>
  invoke({
    endpoint: createUrl(`/api/legal_entities`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "clinics/FETCH_LIST_REQUEST",
      {
        type: "clinics/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [clinic])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging || { cursors: {} })
      },
      "clinics/FETCH_LIST_FAILURE"
    ]
  });

export const fetchClinic = id =>
  invoke({
    endpoint: createUrl(`/api/legal_entities/${id}`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "clinics/FETCH_DETAILS_REQUEST",
      {
        type: "clinics/FETCH_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, clinic))
      },
      "clinics/FETCH_DETAILS_FAILURE"
    ]
  });

export const verifyClinic = id =>
  invoke({
    endpoint: createUrl(`/api/legal_entities/${id}/actions/nhs_verify`),
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "clinics/VERIFY_REQUEST",
      {
        type: "clinics/VERIFY_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, clinic))
      },
      "clinics/VERIFY_FAILURE"
    ]
  });

export const deactivateClinic = id =>
  invoke({
    endpoint: createUrl(`/api/legal_entities/${id}/actions/deactivate`),
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "clinics/DEACTIVATE_REQUEST",
      {
        type: "clinics/DEACTIVATE_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, clinic))
      },
      "clinics/DEACTIVATE_FAILURE"
    ]
  });

export default handleAction(
  combineActions(
    "clinics/FETCH_LIST_SUCCESS",
    "clinics/FETCH_DETAILS_SUCCESS",
    "clinics/CREATE_SUCCESS",
    "clinics/UPDATE_SUCCESS"
  ),
  (state, action) => ({
    ...state,
    ...action.payload.entities.clinics,
    ...action.meta
  }),
  {}
);

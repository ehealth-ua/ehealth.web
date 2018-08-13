import { handleAction, combineActions } from "redux-actions";

import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import { register } from "../schemas";
import { invoke } from "./api";

export const fetchRegisters = options =>
  invoke({
    endpoint: createUrl(`/api/registers`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "registers/FETCH_LIST_REQUEST",
      {
        type: "registers/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [register])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging)
      },
      "registers/FETCH_LIST_FAILURE"
    ]
  });

export const uploadRegister = body =>
  invoke({
    endpoint: createUrl(`/api/registers`),
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "registers/UPLOAD_REQUEST",
      "registers/UPLOAD_SUCCESS",
      {
        type: "registers/UPLOAD_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ],
    body
  });

export const fetchRegisterEntries = options =>
  invoke({
    endpoint: createUrl(`/api/register_entries/`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "registers/FETCH_DETAILS_REQUEST",
      {
        type: "registers/FETCH_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, register))
      },
      "registers/FETCH_DETAILS_FAILURE"
    ]
  });

export default handleAction(
  combineActions(
    "registers/FETCH_LIST_SUCCESS",
    "registers/FETCH_DETAILS_SUCCESS"
  ),
  (state, action) => ({
    ...state,
    ...action.payload.entities.registers,
    ...action.meta
  }),
  {}
);

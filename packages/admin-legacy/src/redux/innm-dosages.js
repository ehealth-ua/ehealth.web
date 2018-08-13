import { handleAction, combineActions } from "redux-actions";

import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import { innm_dosage } from "../schemas";
import { invoke } from "./api";

export const fetchInnmDosages = (options, { useCache = false } = {}) =>
  invoke({
    endpoint: createUrl(`/api/innm_dosages`, options),
    method: "GET",
    bailout: state => useCache && state.data.innm_dosages,
    headers: {
      "content-type": "application/json"
    },
    // bailout: state => useCache && state.data.innm_dosages,
    types: [
      "innm_dosages/FETCH_LIST_REQUEST",
      {
        type: "innm_dosages/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [innm_dosage])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging)
      },
      "innm_dosages/FETCH_LIST_FAILURE"
    ]
  });

export const createInnmDosage = body =>
  invoke({
    endpoint: createUrl(`/api/innm_dosages`),
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "innm_dosages/CREATE_INNM_DOSAGES_REQUEST",
      "innm_dosages/CREATE_INNM_DOSAGES_SUCCESS",
      {
        type: "innm_dosages/CREATE_INNM_DOSAGES_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ],
    body
  });

export const deactivateInnmDosage = id =>
  invoke({
    endpoint: createUrl(`/api/innm_dosages/${id}/actions/deactivate`),
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "innm_dosages/DEACTIVATE_INNM_DOSAGES_REQUEST",
      "innm_dosages/DEACTIVATE_INNM_DOSAGES_SUCCESS",
      {
        type: "innm_dosages/DEACTIVATE_INNM_DOSAGES_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ]
  });

export const fetchInnmDosage = id =>
  invoke({
    endpoint: createUrl(`/api/innm_dosages/${id}`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "innm_dosages/FETCH_DETAILS_REQUEST",
      {
        type: "innm_dosages/FETCH_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, innm_dosage))
      },
      "innm_dosages/FETCH_DETAILS_FAILURE"
    ]
  });

export default handleAction(
  combineActions(
    "innm_dosages/FETCH_LIST_SUCCESS",
    "innm_dosages/FETCH_DETAILS_SUCCESS"
  ),
  (state, action) => ({
    ...state,
    ...action.payload.entities.innm_dosages,
    ...action.meta
  }),
  {}
);

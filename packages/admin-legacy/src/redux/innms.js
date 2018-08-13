import { handleAction, combineActions } from "redux-actions";

import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import { innm } from "../schemas";
import { invoke } from "./api";

export const fetchInnms = (options, { useCache = false } = {}) =>
  invoke({
    endpoint: createUrl(`/api/innms`, options),
    method: "GET",
    bailout: state => useCache && state.data.innms,
    headers: {
      "content-type": "application/json"
    },
    types: [
      "innms/FETCH_LIST_REQUEST",
      {
        type: "innms/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [innm])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging)
      },
      "innms/FETCH_LIST_FAILURE"
    ]
  });

export const createInnm = body =>
  invoke({
    endpoint: createUrl(`/api/innms`),
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "innms/CREATE_INNM_REQUEST",
      "innms/CREATE_INNM_SUCCESS",
      {
        type: "innms/CREATE_INNM_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ],
    body
  });

export const fetchInnm = id =>
  invoke({
    endpoint: createUrl(`/api/innms/${id}`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "innms/FETCH_DETAILS_REQUEST",
      {
        type: "innms/FETCH_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, innm))
      },
      "innms/FETCH_DETAILS_FAILURE"
    ]
  });

export default handleAction(
  combineActions("innms/FETCH_LIST_SUCCESS", "innms/FETCH_DETAILS_SUCCESS"),
  (state, action) => ({
    ...state,
    ...action.payload.entities.innms,
    ...action.meta
  }),
  {}
);

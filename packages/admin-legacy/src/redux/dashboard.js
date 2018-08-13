import { handleAction } from "redux-actions";
import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import * as schemas from "../schemas";
import { invoke } from "./api";

export const fetchGlobalStat = options =>
  invoke({
    endpoint: createUrl(`/api/reports/stats`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "reports/FETCH_GLOBAL_REQUEST",
      {
        type: "reports/FETCH_GLOBAL_SUCCESS",
        payload: (action, state, res) => res.json().then(json => json.data)
      },
      "reports/FETCH_GLOBAL_FAILURE"
    ]
  });

export const fetchDetailStat = options =>
  invoke({
    endpoint: createUrl(`/api/reports/detailedstats`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "reports/FETCH_DETAIL_REQUEST",
      {
        type: "reports/FETCH_DETAIL_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, [schemas.detailStat]))
      },
      "reports/FETCH_DETAIL_FAILURE"
    ]
  });

export const fetchDeclarationsStat = options =>
  invoke({
    endpoint: createUrl(`/api/reports/declarations`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "reports/FETCH_DECLARATIONS_REQUEST",
      {
        type: "reports/FETCH_DECLARATIONS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => ({
            [options.area]: json.data
          }))
      },
      "reports/FETCH_DECLARATIONS_FAILURE"
    ]
  });

export const fetchReports = options =>
  invoke({
    endpoint: createUrl(`/api/reports/log`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "reports/FETCH_REPORTS_REQUEST",
      {
        type: "reports/FETCH_REPORTS_SUCCESS",
        payload: (action, state, res) => res.json().then(json => json.data)
      },
      "reports/FETCH_REPORTS_FAILURE"
    ]
  });

export const globalStat = handleAction(
  "reports/FETCH_GLOBAL_SUCCESS",
  (state, action) => ({
    ...state,
    ...action.payload
  }),
  {}
);

export const detailStat = handleAction(
  "reports/FETCH_DETAIL_SUCCESS",
  (state, action) => ({
    ...state,
    ...action.payload.entities.detailStat
  }),
  []
);

export const reports = handleAction(
  "reports/FETCH_REPORTS_SUCCESS",
  (state, action) => action.payload,
  []
);

export const declarationsStat = handleAction(
  "reports/FETCH_DECLARATIONS_SUCCESS",
  (state, action) => ({
    ...state,
    ...action.payload
  }),
  []
);

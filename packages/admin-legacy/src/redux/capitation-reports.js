import { handleActions } from "redux-actions";

import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import { capitation_report } from "../schemas";

import { invoke } from "./api";

export const fetchCapitationReports = options =>
  invoke({
    endpoint: createUrl(`/api/capitation_report_details`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "reports/FETCH_CAPITATION_REPORTS_REQUEST",
      {
        type: "reports/FETCH_CAPITATION_REPORTS_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [capitation_report])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging || { cursors: {} })
      },
      "reports/FETCH_CAPITATION_REPORTS_FAILURE"
    ]
  });

export default handleActions(
  {
    "reports/FETCH_CAPITATION_REPORTS_SUCCESS": (state, action) => ({
      ...state,
      ...action.payload.entities.capitation_reports,
      ...action.meta
    })
  },
  {}
);

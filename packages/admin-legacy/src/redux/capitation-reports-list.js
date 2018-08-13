import { handleActions } from "redux-actions";

import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import { capitation_reports_list } from "../schemas";

import { invoke } from "./api";

export const fetchCapitationReportsList = options =>
  invoke({
    endpoint: createUrl(`/api/capitation_reports`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "reports/FETCH_CAPITATION_REPORTS_LIST_REQUEST",
      {
        type: "reports/FETCH_CAPITATION_REPORTS_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [capitation_reports_list])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging || { cursors: {} })
      },
      "reports/FETCH_CAPITATION_REPORTS_LIST_FAILURE"
    ]
  });

export default handleActions(
  {
    "reports/FETCH_CAPITATION_REPORTS_LIST_SUCCESS": (state, action) => ({
      ...state,
      ...action.payload.entities.capitation_reports_list,
      ...action.meta
    })
  },
  {}
);

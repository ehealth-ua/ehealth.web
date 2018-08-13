import { handleAction, combineActions } from "redux-actions";

import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import { employeesRequest } from "../schemas";
import { invoke } from "./api";

export const fetchEmployeesRequest = options =>
  invoke({
    endpoint: createUrl(`/api/employee_requests`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "employee_request/FETCH_REQUEST_LIST_REQUEST",
      {
        type: "employee_request/FETCH_REQUEST_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [employeesRequest])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging || { cursors: {} })
      },
      "employee_request/FETCH_REQUEST_LIST_FAILURE"
    ]
  });

export const fetchEmployeeRequest = id =>
  invoke({
    endpoint: createUrl(`/api/employee_requests/${id}`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "employee_request/FETCH_REQUEST_DETAILS_REQUEST",
      {
        type: "employee_request/FETCH_REQUEST_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, employeesRequest))
      },
      "employee_request/FETCH_REQUEST_DETAILS_FAILURE"
    ]
  });

export default handleAction(
  combineActions(
    "employee_request/FETCH_REQUEST_LIST_SUCCESS",
    "employee_request/FETCH_REQUEST_DETAILS_SUCCESS"
  ),
  (state, action) => ({
    ...state,
    ...action.payload.entities.employeesRequests
  }),
  {}
);

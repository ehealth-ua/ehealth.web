import { handleActions, combineActions } from "redux-actions";

import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import { contract } from "../schemas";
import { invoke } from "./api";

export const fetchContracts = options =>
  invoke({
    endpoint: createUrl(`/api/contracts`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "contracts/FETCH_LIST_REQUEST",
      {
        type: "contracts/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [contract])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging || { cursors: {} })
      },
      "contracts/FETCH_LIST_FAILURE"
    ]
  });

export const fetchContractRequests = options =>
  invoke({
    endpoint: createUrl(`/api/contract_requests`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "contracts/FETCH_LIST_REQUEST",
      {
        type: "contracts/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [contract])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging || { cursors: {} })
      },
      "contractsRequests/FETCH_LIST_FAILURE"
    ]
  });

export const fetchContractRequest = id =>
  invoke({
    endpoint: createUrl(`/api/contract_requests/${id}`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "contracts/FETCH_DETAILS_REQUEST",
      {
        type: "contracts/FETCH_CONTRACT_REQUEST_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, contract)),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.urgent)
      },
      "contractsRequests/FETCH_DETAILS_FAILURE"
    ]
  });

export const fetchContract = id =>
  invoke({
    endpoint: createUrl(`/api/contracts/${id}`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "contracts/FETCH_DETAILS_REQUEST",
      {
        type: "contracts/FETCH_CONTRACT_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, contract)),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.urgent)
      },
      "contracts/FETCH_DETAILS_FAILURE"
    ]
  });

export const getContractRequestPrintoutContent = id =>
  invoke({
    endpoint: createUrl(`/api/contract_requests/${id}/printout_content/`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "contracts/FETCH_PRINT_REQUEST",
      {
        type: "contracts/FETCH_PRINT_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, contract))
      },
      "contracts/FETCH_PRINT_FAILURE"
    ]
  });

export const getContractPrintoutContent = id =>
  invoke({
    endpoint: createUrl(`/api/contracts/${id}/printout_content/`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "contracts/FETCH_PRINT_REQUEST",
      {
        type: "contracts/FETCH_PRINT_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, contract))
      },
      "contracts/FETCH_PRINT_FAILURE"
    ]
  });

export const updateContract = (id, body) =>
  invoke({
    endpoint: createUrl(`/api/contract_requests/${id}`),
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "contracts/UPDATE_CONTRACT_REQUEST",
      {
        type: "contracts/UPDATE_CONTRACT_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, contract))
      },
      {
        type: "contracts/UPDATE_CONTRACT_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ],
    body
  });

export const declineContract = (id, body) =>
  invoke({
    endpoint: createUrl(`/api/contract_requests/${id}/actions/decline`),
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "contracts/DECLINE_CONTRACT_REQUEST",
      {
        type: "contracts/DECLINE_CONTRACT_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, contract))
      },
      {
        type: "contracts/DECLINE_CONTRACT_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ],
    body
  });

export const approveContract = (id, body) =>
  invoke({
    endpoint: createUrl(`/api/contract_requests/${id}/actions/approve`),
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "contracts/APPROVE_CONTRACT_REQUEST",
      {
        type: "contracts/APPROVE_CONTRACT_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, contract))
      },
      {
        type: "contracts/APPROVE_CONTRACT_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ],
    body
  });

export const assignContract = (id, body) =>
  invoke({
    endpoint: createUrl(`/api/contract_requests/${id}/actions/assign`),
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "contracts/ASSIGN_CONTRACT_REQUEST",
      {
        type: "contracts/ASSIGN_CONTRACT_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, contract))
      },
      {
        type: "contracts/ASSIGN_CONTRACT_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ],
    body
  });

export const signNhs = (id, body) =>
  invoke({
    endpoint: createUrl(`/api/contract_requests/${id}/actions/sign_nhs`),
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "contracts/SIGN_NHS_CONTRACT_REQUEST",
      {
        type: "contracts/SIGN_NHS_CONTRACT_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, contract))
      },
      {
        type: "contracts/SIGN_NHS_CONTRACT_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ],
    body
  });

export const terminateContract = (id, body) =>
  invoke({
    endpoint: createUrl(`/api/contracts/${id}/actions/terminate`),
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "contracts/TERMINATE_CONTRACT",
      {
        type: "contracts/TERMINATE_CONTRACT_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, contract))
      },
      {
        type: "contracts/TERMINATE_CONTRACT_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ],
    body
  });

export const fetchContractEmployees = options =>
  invoke({
    endpoint: createUrl(`/api/employees`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "contracts/CONTRACT_EMPLOYEES_REQUEST",
      "contracts/CONTRACT_EMPLOYEES_SUCCESS",
      {
        type: "contracts/CONTRACT_EMPLOYEES_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ]
  });

export default handleActions(
  {
    "contracts/FETCH_LIST_SUCCESS": (state, action) => ({
      ...state,
      ...action.payload.entities.contracts,
      ...action.meta
    }),
    [combineActions(
      "contracts/UPDATE_CONTRACT_SUCCESS",
      "contracts/DECLINE_CONTRACT_SUCCESS",
      "contracts/APPROVE_CONTRACT_SUCCESS",
      "contracts/SIGN_NHS_CONTRACT_SUCCESS",
      "contracts/TERMINATE_CONTRACT_SUCCESS",
      "contracts/ASSIGN_CONTRACT_SUCCESS"
    )]: (state, action) => ({
      ...state,
      [action.payload.result]: {
        ...state[action.payload.result],
        ...action.payload.entities.contracts[action.payload.result],
        ...action.meta
      }
    }),
    [combineActions(
      "contracts/FETCH_CONTRACT_REQUEST_DETAILS_SUCCESS",
      "contracts/FETCH_CONTRACT_DETAILS_SUCCESS"
    )]: (state, action) => ({
      ...state,
      [action.payload.result]: {
        ...state[action.payload.result],
        ...action.payload.entities.contracts[action.payload.result],
        urgent: [...action.meta.documents]
      }
    }),
    "contracts/FETCH_PRINT_DETAILS_SUCCESS": (state, action) => ({
      ...state,
      [action.payload.result]: {
        ...state[action.payload.result],
        ...action.payload.entities.contracts[action.payload.result]
      }
    })
  },
  {}
);

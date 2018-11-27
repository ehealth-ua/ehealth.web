import { handleActions, combineActions } from "redux-actions";
import env from "../env";
import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import { declaration } from "../schemas";
import { invoke } from "./api";

export const fetchDeclarations = options =>
  invoke({
    endpoint: createUrl(`/api/declarations`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "declarations/FETCH_LIST_REQUEST",
      {
        type: "declarations/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [declaration])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging || { cursors: {} })
      },
      "declarations/FETCH_LIST_FAILURE"
    ]
  });

export const fetchDeclarationsRequests = options =>
  invoke({
    endpoint: createUrl(`/api/declaration_requests`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "declarations/FETCH_LIST_REQUEST",
      {
        type: "declarations/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [declaration])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging || { cursors: {} })
      },
      "declarationsRequests/FETCH_LIST_FAILURE"
    ]
  });

export const fetchDeclarationRequest = id =>
  invoke({
    endpoint: createUrl(`/api/declaration_requests/${id}`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "declarations/FETCH_DETAILS_REQUEST",
      {
        type: "declarations/FETCH_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, declaration))
      },
      "declarationsRequests/FETCH_DETAILS_FAILURE"
    ]
  });

export const fetchDeclaration = id =>
  invoke({
    endpoint: createUrl(`/api/declarations/${id}`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "declarations/FETCH_DETAILS_REQUEST",
      {
        type: "declarations/FETCH_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, declaration))
      },
      "declarations/FETCH_DETAILS_FAILURE"
    ]
  });

export const updateDeclaration = (id, body) =>
  invoke({
    endpoint: `${env.MOCK_API_URL}/declarations/${id}`,
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "declarations/UPDATE_REQUEST",
      {
        type: "declarations/UPDATE_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(resp => normalize(resp.data, declaration))
      },
      "declarations/UPDATE_FAILURE"
    ],
    body
  });

export const approveDeclaration = id =>
  invoke({
    endpoint: `/api/declarations/${id}/actions/approve`,
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "dictionaries/APPROVE_REQUEST",
      {
        type: "dictionaries/APPROVE_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(resp => normalize(resp.data, declaration))
      },
      "dictionaries/APPROVE_FAILURE"
    ]
  });

export const rejectDeclaration = id =>
  invoke({
    endpoint: `/api/declarations/${id}/actions/reject`,
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "declarations/REJECT_REQUEST",
      {
        type: "declarations/REJECT_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(resp => normalize(resp.data, declaration))
      },
      "declarations/REJECT_FAILURE"
    ]
  });

export const getDeclarationImage = id =>
  invoke({
    endpoint: `/api/declarations/${id}/documents`,
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "declarations/GET_DECLARATION_IMAGE_REQUEST",
      {
        type: "declarations/GET_DECLARATION_IMAGE_SUCCESS",
        payload: (action, state, res) => res.json(),
        meta: () => ({ declaration_id: id })
      },
      "declarations/GET_DECLARATION_IMAGE_FAILURE"
    ]
  });

export const terminateDeclaration = body =>
  invoke({
    endpoint: createUrl(`/api/declarations/terminate`),
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "declarations/TERMINATE_DECLARATION_REQUEST",
      "declarations/TERMINATE_DECLARATION_SUCCESS",
      "declarations/TERMINATE_DECLARATION_FAILURE"
    ],
    body
  });

export default handleActions(
  {
    [combineActions(
      "declarations/FETCH_LIST_SUCCESS",
      "declarations/CREATE_SUCCESS",
      "declarations/UPDATE_SUCCESS"
    )]: (state, action) => ({
      ...state,
      ...action.payload.entities.declarations,
      ...action.meta
    }),
    "declarations/FETCH_DETAILS_SUCCESS": (state, action) => ({
      ...state,
      [action.payload.result]: {
        ...state[action.payload.result],
        ...action.payload.entities.declarations[action.payload.result],
        ...action.meta
      }
    }),
    "declarations/GET_DECLARATION_IMAGE_SUCCESS": (state, action) => ({
      ...state,
      [action.meta.declaration_id]: {
        ...state[action.meta.declaration_id],
        images: action.payload.data
      }
    })
  },
  {}
);

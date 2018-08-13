import { handleAction, combineActions } from "redux-actions";

import { normalize } from "normalizr";
import { createUrl } from "../helpers/url";
import { black_list_user } from "../schemas";
import { invoke } from "./api";

export const fetchBlackListUsers = options =>
  invoke({
    endpoint: createUrl(`/api/black_list_users`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "black_list_users/FETCH_LIST_REQUEST",
      {
        type: "black_list_users/FETCH_LIST_SUCCESS",
        payload: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => normalize(json.data, [black_list_user])),
        meta: (action, state, res) =>
          res
            .clone()
            .json()
            .then(json => json.paging)
      },
      "black_list_users/FETCH_LIST_FAILURE"
    ]
  });

export const createBlackListUsers = body =>
  invoke({
    endpoint: createUrl(`/api/black_list_users`),
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "black_list_users/CREATE_REQUEST",
      "black_list_users/CREATE_SUCCESS",
      {
        type: "black_list_users/CREATE_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ],
    body
  });

export const deactivateBlackListUser = id =>
  invoke({
    endpoint: createUrl(`/api/black_list_users/${id}/actions/deactivate`),
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "black_list_users/DEACTIVATE_REQUEST",
      "black_list_users/DEACTIVATE_SUCCESS",
      {
        type: "black_list_users/DEACTIVATE_FAILURE",
        payload: (action, state, res) => res.json().then(json => json.error)
      }
    ]
  });

export const fetchBlackListUser = id =>
  invoke({
    endpoint: createUrl(`/api/black_list_users/${id}`),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "black_list_users/FETCH_DETAILS_REQUEST",
      {
        type: "black_list_users/FETCH_DETAILS_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, black_list_user))
      },
      "black_list_users/FETCH_DETAILS_FAILURE"
    ]
  });

export default handleAction(
  combineActions("black_list_users/FETCH_LIST_SUCCESS"),
  (state, action) => ({
    ...state,
    ...action.payload.entities.black_list_users
  }),
  {}
);

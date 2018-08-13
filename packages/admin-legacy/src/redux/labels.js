import { handleAction, combineActions } from "redux-actions";
import { REACT_APP_MOCK_API_URL } from "../env";
import { createUrl } from "../helpers/url";
import { invoke } from "./api";

export const fetchLabels = options =>
  invoke({
    endpoint: createUrl(`${REACT_APP_MOCK_API_URL}/labels`, options),
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    types: [
      "labels/FETCH_LIST_REQUEST",
      "labels/FETCH_LIST_SUCCESS",
      "labels/FETCH_LIST_FAILURE"
    ]
  });

export default handleAction(
  combineActions("labels/FETCH_LIST_SUCCESS", "templates/FETCH_LIST_SUCCESS"),
  (state, action) => ({
    ...state,
    ...action.payload.data
  }),
  {}
);

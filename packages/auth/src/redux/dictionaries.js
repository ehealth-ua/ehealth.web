import { handleAction, combineActions } from "redux-actions";
import { normalize } from "normalizr";

import { REACT_APP_API_URL } from "../env";
import { dictionary } from "../schemas";
import { createUrl } from "../helpers/url";

import { invoke } from "./api";

export const fetchDictionaries = options =>
  invoke({
    endpoint: createUrl(`${REACT_APP_API_URL}/api/dictionaries`, options),
    method: "GET",
    types: [
      "dictionaries/FETCH_DICTIONARIES_REQUEST",
      {
        type: "dictionaries/FETCH_DICTIONARIES_SUCCESS",
        payload: (action, state, res) =>
          res.json().then(json => normalize(json.data, [dictionary]))
      },
      "dictionaries/FETCH_DICTIONARIES_FAILURE"
    ]
  });

export default handleAction(
  combineActions("dictionaries/FETCH_DICTIONARIES_SUCCESS"),
  (state, action) => ({
    ...state,
    ...action.payload.entities.dictionaries
  }),
  null
);

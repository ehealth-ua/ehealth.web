import { CALL_API } from "redux-api-middleware";
import { getToken } from "../reducers";

export const invoke = (config, { auth = true } = {}) => (
  dispatch,
  getState
) => {
  const result = {
    ...config
  };

  const authHeaders = {};

  if (auth) {
    const state = getState();
    authHeaders.Authorization = `Bearer ${getToken(state)}`;
  }

  result.headers = {
    "content-type": "application/json",
    pragma: "no-cache",
    "cache-control": "no-cache",
    ...result.headers,
    ...authHeaders
  };

  if (typeof result.body !== "string") {
    result.body = JSON.stringify(result.body);
  }

  return dispatch({
    [CALL_API]: result
  });
};

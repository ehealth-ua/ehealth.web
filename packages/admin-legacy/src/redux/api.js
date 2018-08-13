import { CALL_API } from "redux-api-middleware";
import { getToken } from "./session";

export const invoke = (config, { auth = true } = {}) => (
  dispatch,
  getState
) => {
  const result = {
    credentials: "include",
    ...config
  };

  const authHeaders = {};

  result.headers = {
    "content-type": "application/json",
    pragma: "no-cache",
    "cache-control": "no-cache",
    ...result.headers
  };

  if (typeof result.body !== "string") {
    result.body = JSON.stringify(result.body);
  }

  return dispatch({
    [CALL_API]: result
  });
};

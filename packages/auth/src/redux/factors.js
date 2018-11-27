import env from "../env";
import { invoke } from "./api";

export const initFactor = phone =>
  invoke(
    {
      endpoint: `${env.REACT_APP_AUTH_URL}/oauth/users/actions/init_factor`,
      method: "POST",
      types: [
        "factor/INIT_FACTOR_REQUEST",
        {
          type: "factor/INIT_FACTOR_SUCCESS",
          meta: (action, state, res) =>
            res
              .clone()
              .json()
              .then(json => json.urgent),
          payload: (action, state, res) =>
            res
              .clone()
              .json()
              .then(json => json.data)
        },
        "factor/INIT_FACTOR_FAILURE"
      ],
      body: {
        factor: `+380${phone}`,
        type: "SMS"
      }
    },
    { auth: true }
  );

export const approveFactor = code =>
  invoke(
    {
      endpoint: `${env.REACT_APP_AUTH_URL}/oauth/users/actions/approve_factor`,
      method: "POST",
      types: [
        "factor/APPROVE_FACTOR_REQUEST",
        {
          type: "factor/APPROVE_FACTOR_SUCCESS",
          meta: (action, state, res) =>
            res
              .clone()
              .json()
              .then(json => json.urgent),
          payload: (action, state, res) =>
            res
              .clone()
              .json()
              .then(json => json.data)
        },
        "factor/APPROVE_FACTOR_FAILURE"
      ],
      body: {
        otp: code
      }
    },
    { auth: true }
  );

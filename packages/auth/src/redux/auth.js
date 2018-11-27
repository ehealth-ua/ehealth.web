import { handleAction } from "redux-actions";
import env from "../env";
import { invoke } from "./api";

export const createSessionToken = ({ drfo, ...body }) =>
  invoke({
    endpoint: `${env.REACT_APP_AUTH_URL}/oauth/tokens`,
    method: "POST",
    types: [
      "auth/CREATE_SESSION_TOKEN_REQUEST",
      {
        type: "auth/CREATE_SESSION_TOKEN_SUCCESS",
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
      "auth/CREATE_SESSION_TOKEN_FAILURE"
    ],
    body: {
      token: body
    },
    headers: {
      drfo
    }
  });

export const passwordUpdateRequest = body =>
  invoke({
    endpoint: `${env.REACT_APP_AUTH_URL}/oauth/tokens/actions/change_password`,
    method: "POST",
    types: [
      "auth/PASSWORD_UPDATE_REQUEST",
      "auth/PASSWORD_UPDATE_SUCCESS",
      "auth/PASSWORD_UPDATE_FAILURE"
    ],
    body
  });

export const newPasswordRequest = password =>
  invoke(
    {
      endpoint: `${env.REACT_APP_AUTH_URL}/oauth/users/actions/update_password`,
      method: "POST",
      types: [
        "auth/PASSWORD_UPDATE_REQUEST",
        "auth/PASSWORD_UPDATE_SUCCESS",
        "auth/PASSWORD_UPDATE_FAILURE"
      ],
      body: {
        user: {
          password
        }
      }
    },
    { auth: true }
  );

export const otpVerifyToken = code =>
  invoke(
    {
      endpoint: `${env.REACT_APP_AUTH_URL}/oauth/tokens`,
      method: "POST",
      types: [
        "auth/OTP_VERIFY_TOKEN_REQUEST",
        {
          type: "auth/OTP_VERIFY_TOKEN_SUCCESS",
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
        "auth/OTP_VERIFY_TOKEN_FAILURE"
      ],
      body: {
        token: {
          grant_type: "authorize_2fa_access_token",
          otp: code
        }
      }
    },
    { auth: true }
  );

export const otpResendOtp = () =>
  invoke(
    {
      endpoint: `${env.REACT_APP_AUTH_URL}/oauth/tokens`,
      method: "POST",
      types: [
        "auth/OTP_RESEND_TOKEN_REQUEST",
        {
          type: "auth/OTP_RESEND_TOKEN_SUCCESS",
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
        "auth/OTP_RESEND_TOKEN_FAILURE"
      ],
      body: {
        token: {
          grant_type: "refresh_2fa_access_token"
        }
      }
    },
    { auth: true }
  );

export const fetchSessionToken = token =>
  invoke({
    endpoint: `${env.REACT_APP_AUTH_URL}/admin/tokens/${token}/verify`,
    method: "GET",
    types: [
      "auth/FETCH_SESSION_TOKEN_REQUEST",
      {
        type: "auth/FETCH_SESSION_TOKEN_SUCCESS",
        payload: (action, state, res) => res.json().then(json => json.data)
      },
      "auth/FETCH_SESSION_TOKEN_FAILURE"
    ]
  });

export const updatePassword = (id, body) =>
  invoke({
    endpoint: `${env.REACT_APP_AUTH_URL}/users/${id}/actions/change_password`,
    method: "PATCH",
    types: [
      "auth/UPDATE_PASSWORD_REQUEST",
      "auth/UPDATE_PASSWORD_SUCCESS",
      "auth/UPDATE_PASSWORD_FAILURE"
    ],
    body: {
      user: {
        ...body
      }
    }
  });

export const authorize = ({ clientId, scope, redirectUri }) =>
  invoke(
    {
      endpoint: `${env.REACT_APP_AUTH_URL}/oauth/apps/authorize`,
      method: "POST",
      types: [
        "auth/AUTHORIZE_REQUEST",
        {
          type: "auth/AUTHORIZE_SUCCESS",
          payload: (action, state, res) =>
            res.json().then(json => ({
              ...json,
              headers: res.headers
            }))
        },
        "auth/AUTHORIZE_FAILURE"
      ],
      body: {
        app: {
          client_id: clientId,
          redirect_uri: redirectUri,
          scope
        }
      }
    },
    { auth: true }
  );

export const getNonce = client_id =>
  invoke({
    endpoint: `${env.REACT_APP_AUTH_URL}/oauth/nonce`,
    method: "POST",
    types: ["auth/NONCE_REQUEST", "auth/NONCE_SUCCESS", "auth/NONCE_FAILURE"],
    body: {
      client_id
    }
  });

export default handleAction(
  "auth/CREATE_SESSION_TOKEN_SUCCESS",
  "auth/FETCH_SESSION_TOKEN_REQUEST",
  (state, action) => ({
    ...state,
    ...action.payload
  }),
  {}
);

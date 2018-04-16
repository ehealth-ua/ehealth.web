import { handleAction } from "redux-actions";

// import { REACT_APP_API_URL } from "../env";

import { invoke } from "./api";

export const verifyEmail = body =>
  invoke({
    endpoint: "/api/cabinet/email_verification",
    method: "POST",
    types: [
      "cabinet/VERIFY_EMAIL_REQUEST",
      "cabinet/VERIFY_EMAIL_SUCCESS",
      "cabinet/VERIFY_EMAIL_FAILURE"
    ],
    body
  });

export const validateEmail = () =>
  invoke({
    endpoint: "/api/cabinet/email_validation",
    method: "POST",
    types: [
      "cabinet/VALIDATE_EMAIL_REQUEST",
      "cabinet/VALIDATE_EMAIL_SUCCESS",
      "cabinet/VALIDATE_EMAIL_FAILURE"
    ]
  });

export const getUser = ({ drfo, ...body }) =>
  invoke({
    endpoint: "/api/cabinet/users",
    method: "POST",
    types: [
      "cabinet/GET_USER_REQUEST",
      "cabinet/GET_USER_SUCCESS",
      "cabinet/GET_USER_FAILURE"
    ],
    headers: { drfo },
    body
  });

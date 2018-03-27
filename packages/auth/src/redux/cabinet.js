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

import { REACT_APP_API_URL, REACT_APP_DIGITAL_SIGNATURE_ENABLED } from "../env";

import { invoke } from "./api";

export const verifyEmail = body =>
  invoke({
    endpoint: `${REACT_APP_API_URL}/api/cabinet/email_verification`,
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
    endpoint: `${REACT_APP_API_URL}/api/cabinet/email_validation`,
    method: "POST",
    types: [
      "cabinet/VALIDATE_EMAIL_REQUEST",
      "cabinet/VALIDATE_EMAIL_SUCCESS",
      "cabinet/VALIDATE_EMAIL_FAILURE"
    ]
  });

export const getUser = ({ signed_content, ...headers }) =>
  invoke({
    endpoint: `${REACT_APP_API_URL}/api/cabinet/users`,
    method: "POST",
    types: [
      "cabinet/GET_USER_REQUEST",
      "cabinet/GET_USER_SUCCESS",
      "cabinet/GET_USER_FAILURE"
    ],
    body: {
      signed_content,
      signed_content_encoding: "base64"
    },
    ...(!!REACT_APP_DIGITAL_SIGNATURE_ENABLED || { headers })
  });

export const sendOtp = body =>
  invoke({
    endpoint: `${REACT_APP_API_URL}/api/sms_verifications`,
    method: "POST",
    types: [
      "cabinet/SEND_OTP_REQUEST",
      "cabinet/SEND_OTP_SUCCESS",
      "cabinet/SEND_OTP_FAILURE"
    ],
    body
  });

export const register = ({ signed_content, password, otp, ...headers }) =>
  invoke({
    endpoint: `${REACT_APP_API_URL}/api/cabinet/registration`,
    method: "POST",
    types: [
      "cabinet/REGISTRATION_REQUEST",
      "cabinet/REGISTRATION_SUCCESS",
      "cabinet/REGISTRATION_FAILURE"
    ],
    body: {
      signed_content,
      signed_content_encoding: "base64",
      password,
      otp
    },
    ...(!!REACT_APP_DIGITAL_SIGNATURE_ENABLED || { headers })
  });

import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
import { getLocation } from "../../../reducers";
import { createSessionToken } from "../../../redux/auth";
import { createUserFromRequest } from "../../../redux/user";
import { login } from "../../../redux/session";
import { REACT_APP_CLIENT_ID } from "../../../env";
import error_messages from "../../../helpers/errors";

export const onSubmitSignUp = (employeeRequestId, email, password) => (
  dispatch,
  getState
) =>
  dispatch(createUserFromRequest(employeeRequestId, { password })).then(
    action => {
      if (action.error) return new Error(action.error);

      return dispatch(
        createSessionToken({
          grant_type: "password",
          email,
          password,
          client_id: REACT_APP_CLIENT_ID,
          scope: "employee_request:approve employee_request:reject"
        })
      ).then(action => {
        if (action.error) return new Error(action.error);

        const state = getState();
        const location = getLocation(state);
        const { next_step } = action.meta;
        dispatch(login(action.payload.value));

        switch (next_step) {
          case "REQUEST_APPS": {
            return dispatch(push({ ...location, pathname: "/invite/accept" }));
          }

          case "REQUEST_OTP": {
            return dispatch(push({ ...location, pathname: "/otp-send" }));
          }

          case "RESEND_OTP": {
            throw new SubmissionError({
              email: { resentOtp: true }
            });
          }

          case "REQUEST_FACTOR": {
            return dispatch(push({ ...location, pathname: "/request-factor" }));
          }

          default: {
            break;
          }
        }
        return true;
      });
    }
  );

export const onSubmitSignIn = (employeeRequestId, email, password) => (
  dispatch,
  getState
) =>
  dispatch(
    createSessionToken({
      grant_type: "password",
      email,
      password,
      client_id: REACT_APP_CLIENT_ID,
      scope: "employee_request:approve employee_request:reject"
    })
  ).then(action => {
    if (action.error) {
      const { message, type } = action.payload.response.error;
      const error = error_messages[message] || error_messages.defaultError;

      if (type === "password_expired") {
        throw new SubmissionError({
          password: {
            password_expired: true
          }
        });
      }
      if (error) {
        throw new SubmissionError({
          password: { [error]: true }
        });
      }
    }

    const { next_step } = action.meta;
    dispatch(login(action.payload.value));

    const state = getState();
    const location = getLocation(state);

    switch (next_step) {
      case "REQUEST_APPS": {
        return dispatch(push({ ...location, pathname: "/invite/accept" }));
      }

      case "REQUEST_OTP": {
        return dispatch(push({ ...location, pathname: "/otp-send" }));
      }

      case "RESEND_OTP": {
        throw new SubmissionError({
          email: { resentOtp: true }
        });
      }

      case "REQUEST_FACTOR": {
        return dispatch(push({ ...location, pathname: "/request-factor" }));
      }

      default: {
        break;
      }
    }
    return true;
  });

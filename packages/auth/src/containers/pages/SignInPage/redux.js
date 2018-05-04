import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
import { getLocation } from "../../../reducers";
import { createSessionToken } from "../../../redux/auth";
import { login } from "../../../redux/session";
import { fetchUserData } from "../../../redux/user";
import error_messages from "../../../helpers/errors";

export const onSubmit = ({ email, password, client_id }) => (
  dispatch,
  getState
) =>
  dispatch(
    createSessionToken({
      grant_type: "password",
      email,
      password,
      client_id,
      scope: "app:authorize"
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

      if (message) {
        throw new SubmissionError({
          email: { [error]: true }
        });
      }
      return action;
    }

    const { next_step } = action.meta;
    dispatch(login(action.payload.value));

    switch (next_step) {
      case "REQUEST_APPS": {
        return dispatch(fetchUserData(action.payload.value)).then(action => {
          if (action.error) {
            throw new SubmissionError({
              email: { accountPasswordMismatch: true }
            });
          }
          const state = getState();
          const location = getLocation(state);

          return dispatch(push({ ...location, pathname: "/accept" }));
        });
      }

      case "REQUEST_OTP": {
        const state = getState();
        const location = getLocation(state);
        return dispatch(push({ ...location, pathname: "/otp-send" }));
      }

      case "REQUEST_FACTOR": {
        const state = getState();
        const location = getLocation(state);
        return dispatch(push({ ...location, pathname: "/request-factor" }));
      }

      default: {
        break;
      }
    }
    return true;
  });

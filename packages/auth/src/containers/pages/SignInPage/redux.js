import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
import { getLocation } from "../../../reducers";
import { initAuthRequest, createSessionToken } from "../../../redux/auth";
import { login } from "../../../redux/session";
import { fetchUserData } from "../../../redux/user";
import error_messages from "../../../helpers/errors";
import env from "../../../env";

export const onSubmit = ({ email, password, client_id }, token) => (
  dispatch,
  getState
) =>
  dispatch(
    createSessionToken({
      grant_type: "password",
      email,
      password,
      client_id: env.REACT_APP_CLIENT_ID,
      scope: "app:authorize",
      token
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

    const state = getState();
    const location = getLocation(state);

    switch (next_step) {
      case "REQUEST_APPS": {
        return dispatch(fetchUserData(action.payload.value)).then(action => {
          if (action.error) {
            throw new SubmissionError({
              email: { accountPasswordMismatch: true }
            });
          }
          return dispatch(push({ ...location, pathname: "/accept" }));
        });
      }

      case "REQUEST_OTP": {
        return dispatch(push({ ...location, pathname: "/otp-send" }));
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

export const idGovUaAuthenticate = ({ token, ...params }) => async dispatch => {
  const initAuthRequestAction = await dispatch(
    initAuthRequest({ token, ...params })
  );

  // FIXME: We should handle auth request errors somehow
  if (initAuthRequestAction.error) return;

  const redirectParams = new URLSearchParams({
    response_type: "code",
    auth_type: env.REACT_APP_ID_GOV_UA_AUTH_TYPE,
    client_id: env.REACT_APP_ID_GOV_UA_CLIENT_ID,
    redirect_uri: env.REACT_APP_ID_GOV_UA_REDIRECT_URI,
    state: token
  });

  const redirectUrl = `${env.REACT_APP_ID_GOV_UA_OAUTH_URL}/?${redirectParams}`;

  window.location.assign(redirectUrl);
};

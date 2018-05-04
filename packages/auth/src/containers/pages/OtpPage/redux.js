import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
import { getLocation } from "../../../reducers";
import { otpVerifyToken, otpResendOtp, authorize } from "../../../redux/auth";
import { fetchUserData } from "../../../redux/user";
import { login } from "../../../redux/session";

export const onSubmit = ({ code }) => async (dispatch, getState) => {
  const { payload: { value: token, details, response }, meta } = await dispatch(
    otpVerifyToken(parseInt(code, 10))
  );
  if (response && response.error) {
    const { type } = response.error;
    if (type) {
      throw new SubmissionError({
        code: {
          [type]: true
        }
      });
    }
    return response.error;
  }
  dispatch(login(token));
  if (meta.next_step === "REQUEST_APPS") {
    return dispatch(
      authorize({
        clientId: details.client_id,
        redirectUri: details.redirect_uri
      })
    ).then(({ payload, error }) => {
      return window && (window.location = payload.headers.get("location"));
    });
  }
  return dispatch(fetchUserData(token)).then(action => {
    if (action.error) {
      return action;
    }
    const state = getState();
    const location = getLocation(state);
    return dispatch(
      push({
        ...location,
        pathname: location.query.invite ? "/invite/accept" : "/accept"
      })
    );
  });
};

export const onResend = () => dispatch =>
  dispatch(otpResendOtp()).then(action => {
    if (action.error) {
      const { message } = action.payload.response.error;
      if (message === "Sending OTP timeout. Try later.") {
        return false;
      }
      return action;
    }
    dispatch(login(action.payload.value));
    return action;
  });

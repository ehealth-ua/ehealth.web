import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
import { getLocation } from "../../../reducers";
import { newPasswordRequest } from "../../../redux/auth";

export const onSubmit = ({ password }) => (dispatch, getState) =>
  dispatch(newPasswordRequest(password)).then(action => {
    if (action.error) {
      const { message, invalid } = action.payload.response.error;
      if (invalid && invalid[0].entry === "$.password") {
        throw new SubmissionError({
          password: {
            password_already_taken: true
          }
        });
      } else if (message === "Token expired") {
        throw new SubmissionError({
          password: {
            access_denied: true
          }
        });
      }
    }

    const state = getState();
    const location = getLocation(state);
    return dispatch(
      push({
        ...location,
        pathname: "/update-password/success"
      })
    );
  });

import { SubmissionError } from "redux-form";
import { newPasswordRequest } from "../../../redux/password";

export const onSubmit = (values, props) => dispatch => {
  if (values.password !== values.confirm_password) {
    throw new SubmissionError({
      confirm_password: {
        confirmation: true
      }
    });
  }
  return dispatch(
    newPasswordRequest(props.params.id, { password: values.password })
  ).then(action => {
    const { error, payload } = action;
    if (error && payload.status === 422) {
      if (payload.response.error.invalid[0].rules[0].rule === "password_used") {
        throw new SubmissionError({
          password: {
            password_used: true
          }
        });
      }
    }
    return action;
  });
};

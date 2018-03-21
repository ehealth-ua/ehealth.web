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
  );
};

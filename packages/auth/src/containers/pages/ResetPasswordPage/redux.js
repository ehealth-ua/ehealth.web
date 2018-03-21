import { SubmissionError } from "redux-form";
import { passwordRecoveryRequest } from "../../../redux/password";

export const onSubmit = ({ email }) => dispatch =>
  dispatch(passwordRecoveryRequest(email)).then(action => {
    if (action.error) {
      throw new SubmissionError({
        email: {
          accountPasswordMismatch: true
        }
      });
    }
    return action;
  });

import { push } from "react-router-redux";
import { createBlackListUsers } from "../../../redux/black-list-users";

export const onSubmit = ({ tax_id }) => dispatch => {
  return dispatch(createBlackListUsers({ tax_id })).then(
    ({ error, payload }) => {
      if (!error) return dispatch(push(`/black-list-users/${payload.data.id}`));
    }
  );
};

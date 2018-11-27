import { handleAction } from "redux-actions";
import env from "../env";
import { normalize } from "normalizr";
import { client } from "../schemas";
import { invoke } from "./api";

export const fetchClientById = id =>
  invoke(
    {
      endpoint: `${env.REACT_APP_AUTH_URL}/oauth/clients/${id}/details`,
      method: "GET",
      types: [
        "client/FETCH_CLIENT_REQUEST",
        {
          type: "client/FETCH_CLIENT_SUCCESS",
          payload: (action, state, res) =>
            res.json().then(json => normalize(json.data, client))
        },
        "client/FETCH_CLIENT_FAILURE"
      ]
    },
    { auth: true }
  );

export default handleAction(
  "client/FETCH_CLIENT_SUCCESS",
  (state, action) => ({
    ...state,
    ...action.payload.entities.clients
  }),
  {}
);

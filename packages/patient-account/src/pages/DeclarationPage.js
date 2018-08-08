import React from "react";
import { Query } from "react-apollo";

import DeclarationQuery from "../graphql/DeclarationQuery.graphql";
import Declaration from "../components/Declaration";
import Spinner from "../components/Spinner";

const DeclarationPage = ({
  match: {
    params: { id }
  },
  history
}) => (
  <Query query={DeclarationQuery} variables={{ id }}>
    {({ loading, error, data: { declaration } }) => {
      if (loading || error) return <Spinner />;

      return <Declaration history={history} data={declaration.data} />;
    }}
  </Query>
);

export default DeclarationPage;

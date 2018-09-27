import React from "react";
import { Query } from "react-apollo";

import DeclarationQuery from "../graphql/DeclarationQuery.graphql";
import Declaration from "../components/Declaration";
import { Spinner } from "@ehealth/components";

const DeclarationPage = ({ id, navigate }) => (
  <Query query={DeclarationQuery} variables={{ id }}>
    {({ loading, error, data: { declaration } }) => {
      if (loading || error) return <Spinner />;

      return <Declaration navigate={navigate} data={declaration.data} />;
    }}
  </Query>
);

export default DeclarationPage;

import React from "react";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";

import Declaration from "../components/Declaration";
import { Spinner } from "@ehealth/components";

const DeclarationQuery = loader("../graphql/DeclarationQuery.graphql");

const DeclarationPage = ({ id, navigate }) => (
  <Query query={DeclarationQuery} variables={{ id }}>
    {({ loading, error, data: { declaration } }) => {
      if (loading || error) return <Spinner />;

      return <Declaration navigate={navigate} data={declaration.data} />;
    }}
  </Query>
);

export default DeclarationPage;

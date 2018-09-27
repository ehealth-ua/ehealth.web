import React from "react";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";

import Declaration from "../components/Declaration";
import { Spinner } from "@ehealth/components";

const DeclarationRequestQuery = gql`
  query Declaration($id: ID!) {
    declaration(id: $id)
      @rest(
        path: "/cabinet/declaration_requests/:id"
        params: { id: $id }
        type: "DeclarationRequestsPayload"
      ) {
      data
    }
  }
`;

const DeclarationRequestPage = ({ id, navigate }) => (
  <Query query={DeclarationRequestQuery} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading || error) return <Spinner />;
      return <Declaration navigate={navigate} data={data.declaration.data} />;
    }}
  </Query>
);

export default DeclarationRequestPage;

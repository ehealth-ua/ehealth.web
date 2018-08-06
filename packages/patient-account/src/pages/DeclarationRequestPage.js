import React from "react";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";

import Declaration from "../components/Declaration";

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

const DeclarationRequestPage = ({ match: { params: { id } }, history }) => (
  <Query query={DeclarationRequestQuery} variables={{ id }}>
    {({ loading, error, data }) => {
      if (!data.declaration) return null;
      return <Declaration history={history} data={data.declaration.data} />;
    }}
  </Query>
);

export default DeclarationRequestPage;

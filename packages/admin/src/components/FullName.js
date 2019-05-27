import React from "react";
import gql from "graphql-tag";
import { getFullName } from "@ehealth/utils";

const FullName = ({ party }) => <>{getFullName(party)}</>;

FullName.fragments = {
  entry: gql`
    fragment FullName on Party {
      firstName
      secondName
      lastName
    }
  `
};

export default FullName;

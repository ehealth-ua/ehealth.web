import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import format from "date-fns/format";
import ReactDOM from "react-dom";
import { Link as RouterLink } from "react-router-dom";
import { withRouter } from "react-router";
import { injectGlobal } from "react-emotion/macro";

import { MozLogoIcon, CircleIcon } from "@ehealth/icons";
import { Title, Button, Link, Switch } from "@ehealth/components";

import Declaration from "../components/Declaration";
import DefinitionListView from "../components/DefinitionListView";
import FixedBlock from "../components/FixedBlock";
import DictionaryValue from "../components/DictionaryValue";
import DECLARATION_STATUSES from "../helpers/statuses";
import DeclarationQuery from "../graphql/DeclarationQuery.graphql";

const DeclarationPage = ({ match: { params: { id } }, history }) => (
  <Query query={DeclarationQuery} variables={{ id }}>
    {({ loading, error, data }) => {
      if (!data.declaration) return null;
      return <Declaration history={history} data={data.declaration.data} />;
    }}
  </Query>
);

export default DeclarationPage;

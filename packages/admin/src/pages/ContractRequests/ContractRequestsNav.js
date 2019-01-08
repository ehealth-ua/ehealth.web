import React from "react";
import { Heading } from "@rebass/emotion";
import { Tabs } from "@ehealth/components";
import { Trans } from "@lingui/macro";

const ContractRequestsNav = () => (
  <>
    <Heading as="h1" fontWeight="normal" mb={6}>
      <Trans>Contract request list</Trans>
    </Heading>
    <Tabs.Nav justifyContent="center">
      <Tabs.Link to="../capitation">
        <Trans>Medical institutions</Trans>
      </Tabs.Link>
      <Tabs.Link to="../reimbursement">
        <Trans>Pharmacies</Trans>
      </Tabs.Link>
    </Tabs.Nav>
  </>
);

export default ContractRequestsNav;

import React from "react";
import { Heading } from "rebass/emotion";
import { Tabs } from "@ehealth/components";
import { Trans } from "@lingui/macro";

const ContractRequestsNav = () => (
  <>
    <Heading as="h1" fontWeight="normal" mb={6}>
      <Trans>Перелік заяв на укладення договору</Trans>
    </Heading>
    <Tabs.Nav>
      <Tabs.Link to="../capitation">
        <Trans>Медзаклади</Trans>
      </Tabs.Link>
      <Tabs.Link to="../reimbursement">
        <Trans>Аптеки</Trans>
      </Tabs.Link>
    </Tabs.Nav>
  </>
);

export default ContractRequestsNav;

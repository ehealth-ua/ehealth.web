import React from "react";
import { Heading } from "rebass/dist/emotion";
import { Tabs } from "@ehealth/components";

const ContractRequestsNav = () => (
  <>
    <Heading as="h1" fontWeight="normal" mb={6}>
      Перелік заяв на укладення договору
    </Heading>
    <Tabs.Nav>
      <Tabs.Link to="../capitation">Медзаклади</Tabs.Link>
      <Tabs.Link to="../reimbursement">Аптеки</Tabs.Link>
    </Tabs.Nav>
  </>
);

export default ContractRequestsNav;

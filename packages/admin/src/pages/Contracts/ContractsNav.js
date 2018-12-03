import React from "react";
import { Heading } from "rebass/emotion";
import { Tabs } from "@ehealth/components";

const ContractsNav = () => (
  <>
    <Heading as="h1" fontWeight="normal" mb={6}>
      Перелік договорів
    </Heading>
    <Tabs.Nav>
      <Tabs.Link to="../capitation">Медзаклади</Tabs.Link>
      <Tabs.Link to="../reimbursement">Аптеки</Tabs.Link>
    </Tabs.Nav>
  </>
);

export default ContractsNav;

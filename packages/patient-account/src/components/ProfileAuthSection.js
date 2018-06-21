import React from "react";
import { Heading } from "@ehealth/components";
import { formatPhone } from "@ehealth/utils";

import Section from "./Section";
import DefinitionListView from "./DefinitionListView";

const ProfileAuthSection = ({ data }) => (
  <Section>
    <Heading.H3 weight="bold">Авторизація</Heading.H3>

    <DefinitionListView
      labels={{
        email: "Email",
        phoneNumber: "Номер телефону"
      }}
      data={{
        ...data,
        phoneNumber: formatPhone(getAuthPhoneNumber(data))
      }}
    />
  </Section>
);

export default ProfileAuthSection;

const getAuthPhoneNumber = ({ authenticationMethods }) => {
  const { phoneNumber } =
    authenticationMethods.find(m => m.type === "OTP") || {};

  return phoneNumber;
};

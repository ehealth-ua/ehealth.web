import React from "react";
import { Link, Button } from "@ehealth/components";

import DeclarationPreview from "../components/DeclarationPreview";
import FixedBlock from "../components/FixedBlock";

const DeclarationPage = () => (
  <>
    <DeclarationPreview />
    <FixedBlock>
      <Link size="small" upperCase bold to="/">
        Повернутись
      </Link>
      <Button size="small" upperCase bold>
        Роздрукувати декларацію
      </Button>
    </FixedBlock>
  </>
);
export default DeclarationPage;

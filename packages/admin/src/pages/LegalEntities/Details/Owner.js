//@flow
import React from "react";
import gql from "graphql-tag";
import { Box } from "@rebass/emotion";
import { Trans } from "@lingui/macro";
import { getFullName } from "@ehealth/utils";
import DictionaryValue from "../../../components/DictionaryValue";
import DefinitionListView from "../../../components/DefinitionListView";

import type { LegalEntity } from "@ehealth-ua/schema";

const Owner = ({
  owner: { party, databaseId, position, additionalInfo: doctor }
}: {
  owner: LegalEntity.owner
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        party: <Trans>PIB</Trans>,
        speciality: <Trans>Specialty</Trans>,
        position: <Trans>Position</Trans>
      }}
      data={{
        party: getFullName(party),
        speciality: doctor.specialities && (
          <DictionaryValue
            name="SPECIALITY_TYPE"
            render={dict => (
              <>
                {doctor.specialities.map(({ speciality }, index, array) => (
                  <React.Fragment key={index}>
                    {dict[speciality]}
                    {array.length - 1 !== index && ", "}
                  </React.Fragment>
                ))}
              </>
            )}
          />
        ),

        position: <DictionaryValue name="POSITION" item={position} />
      }}
    />
    <DefinitionListView
      labels={{ databaseId: "Id" }}
      data={{ databaseId }}
      color="blueberrySoda"
    />
  </Box>
);

Owner.fragments = {
  entry: gql`
    fragment LegalEntityOwner on LegalEntity {
      owner {
        id
        databaseId
        position
        startDate
        endDate
        status
        employeeType
        party {
          id
          firstName
          lastName
          secondName
        }
        additionalInfo {
          specialities {
            speciality
          }
        }
      }
    }
  `
};

export default Owner;

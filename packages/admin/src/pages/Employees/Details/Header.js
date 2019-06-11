//@flow
import * as React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import { Box, Flex } from "@rebass/emotion";
import { PositiveIcon } from "@ehealth/icons";
import Badge from "../../../components/Badge";
import Popup from "../../../components/Popup";
import Button from "../../../components/Button";
import Ability from "../../../components/Ability";
import FullName from "../../../components/FullName";
import DefinitionListView from "../../../components/DefinitionListView";
import type { Scalars, Party, Employee, LegalEntity } from "@ehealth-ua/schema";

// Temporary solution
import EmployeeQuery from "./";

const Header = ({
  id,
  databaseId,
  party,
  status,
  employeeType,
  legalEntityType,
  navigate
}: {
  id: Scalars.ID,
  databaseId: Scalars.UUID,
  party: Party,
  status: Employee.status,
  employeeType: Employee.employeeType,
  legalEntityType: LegalEntity.type,
  navigate: any => mixed
}): React.Node => {
  const [isVisible, setVisibilityState] = React.useState(false);
  const toggle = () => setVisibilityState(!isVisible);
  return (
    <Flex justifyContent="space-between" alignItems="flex-end">
      <Box>
        <DefinitionListView
          labels={{
            databaseId: <Trans>Employee ID</Trans>,
            name: <Trans>Name of employee</Trans>,
            taxId: <Trans>INN</Trans>,
            noTaxId: <Trans>No tax ID</Trans>,
            status: <Trans>Employee status</Trans>
          }}
          data={{
            databaseId,
            taxId: party.taxId,
            name: <FullName party={party} />,
            noTaxId: party.noTaxId ? <PositiveIcon /> : null,
            status: (
              <Badge name={status} type="EMPLOYEE_STATUS" minWidth={100} />
            )
          }}
          color="#7F8FA4"
          labelWidth="120px"
        />
      </Box>
      {status === "APPROVED" &&
        employeeType !== "OWNER" &&
        legalEntityType === "NHS" && (
          <Flex justifyContent="flex-end" flexWrap="wrap">
            <Button
              mt={2}
              variant="blue"
              onClick={() => navigate(`../update/${id}`)}
            >
              <Trans>Update</Trans>
            </Button>
            <Ability action="deactivate" resource="employee">
              <Mutation
                mutation={DeactivateEmployee}
                refetchQueries={() => [
                  {
                    query: EmployeeQuery,
                    variables: { id }
                  }
                ]}
              >
                {deactivateEmployee => (
                  <>
                    <Button mt={2} ml={2} onClick={toggle} variant="red">
                      <Trans>Dismiss</Trans>
                    </Button>
                    <Popup
                      visible={isVisible}
                      onCancel={toggle}
                      title={
                        <>
                          <Trans>Dismiss employee</Trans>{" "}
                          <FullName party={party} />
                          }?
                        </>
                      }
                      okText={<Trans>Dismiss</Trans>}
                      onOk={async () => {
                        await deactivateEmployee({
                          variables: {
                            input: {
                              id
                            }
                          }
                        });
                        toggle();
                      }}
                    />
                  </>
                )}
              </Mutation>
            </Ability>
          </Flex>
        )}
    </Flex>
  );
};

Header.fragments = {
  entry: gql`
    fragment Header on Employee {
      databaseId
      status
      employeeType
      party {
        id
        ...FullName
        taxId
        noTaxId
      }
      legalEntity {
        id
        databaseId
        name
        type
      }
    }
    ${FullName.fragments.entry}
  `
};

const DeactivateEmployee = gql`
  mutation DeactivateEmployee($input: DeactivateEmployeeInput!) {
    deactivateEmployee(input: $input) {
      employee {
        id
      }
    }
  }
`;

export default Header;

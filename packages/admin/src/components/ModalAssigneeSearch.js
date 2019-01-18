import React from "react";
import { BooleanValue } from "react-values";
import { Query, Mutation } from "react-apollo";
import { loader } from "graphql.macro";
import { Manager, Reference, Popper } from "react-popper";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { t } from "@lingui/macro";
import { I18n } from "@lingui/react";
import { Flex } from "@rebass/emotion";
import system from "@ehealth/system-components";

import { getFullName } from "@ehealth/utils";
import { boolean } from "@ehealth/system-tools";
import { Form } from "@ehealth/components";
import { DropDownButton } from "@ehealth/icons";

import * as Field from "./Field";

const AssignContractRequestMutation = loader(
  "../graphql/AssignContractRequestMutation.graphql"
);
const GetAssignEmployeeQuery = loader(
  "../graphql/GetAssignEmployeeQuery.graphql"
);

const ModalAssigneeSearch = ({ submitted, id, query }) => (
  <BooleanValue>
    {({ value: opened, toggle }) => (
      <Form onSubmit={() => null}>
        <Mutation
          mutation={AssignContractRequestMutation}
          refetchQueries={() => [
            {
              query,
              variables: { id }
            }
          ]}
        >
          {assignContractRequest => (
            <Form.AutoSubmit
              onSubmit={({ assignee }) => {
                if (assignee) {
                  assignContractRequest({
                    variables: {
                      input: {
                        id,
                        employeeId: assignee.id
                      }
                    }
                  });
                  toggle();
                }
              }}
            />
          )}
        </Mutation>
        <Manager>
          <Reference>
            {({ ref }) => (
              <Flex ref={ref} alignItems="center">
                {submitted}
                <ButtonWrapper onClick={toggle}>
                  {!submitted && <DropDownButton color="#2EA2F8" />}
                  <ButtonText>
                    {!submitted ? "Додати виконавця" : "Змінити"}
                  </ButtonText>
                </ButtonWrapper>
              </Flex>
            )}
          </Reference>
          {opened && (
            <Popper placement="bottom-start" positionFixed>
              {({ ref, style }) => (
                <ModalWrapper style={style} ref={ref}>
                  <Query
                    query={GetAssignEmployeeQuery}
                    fetchPolicy="no-cache"
                    variables={{
                      skip: true,
                      first: 50,
                      filter: {
                        employeeType: ["NHS", "NHS_SIGNER"],
                        status: "APPROVED"
                      },
                      orderBy: "INSERTED_AT_DESC"
                    }}
                  >
                    {({ data, refetch: refetchEmployees }) => {
                      const { employees } = data || {};

                      return (
                        <I18n>
                          {({ i18n }) => (
                            <Field.Select
                              name="assignee"
                              placeholder={i18n._(t`Choose assignee`)}
                              items={
                                employees &&
                                employees.nodes.map(({ id, party }) => ({
                                  id,
                                  name: getFullName(party)
                                }))
                              }
                              onInputValueChange={debounce(
                                name =>
                                  !isEmpty(name) &&
                                  opened &&
                                  refetchEmployees({
                                    skip: false,
                                    first: 50,
                                    filter: {
                                      employeeType: ["NHS", "NHS_SIGNER"],
                                      status: "APPROVED",
                                      party: { fullName: name }
                                    }
                                  }),
                                1000
                              )}
                              itemToString={item => item && item.name}
                              filterOptions={{ keys: ["name"] }}
                              style={{
                                margin: "5px",
                                border: "1px solid #DFE3E9"
                              }}
                              hideErrors
                              autoFocus
                            />
                          )}
                        </I18n>
                      );
                    }}
                  </Query>
                </ModalWrapper>
              )}
            </Popper>
          )}
        </Manager>
      </Form>
    )}
  </BooleanValue>
);

export default ModalAssigneeSearch;

const ModalWrapper = system(
  {
    width: 245,
    mt: 2,
    fontSize: 1,
    color: "darkAndStormy"
  },
  {
    zIndex: 100,
    boxShadow: "0 1px 4px rgba(72, 60, 60, 0.2)"
  },
  boolean({
    prop: "visible",
    key: "inputs.select.visible"
  }),
  "space",
  "color",
  "fontSize",
  "width"
);

const ButtonWrapper = system(
  {},
  {
    display: "flex",
    cursor: "pointer"
  }
);

const ButtonText = system(
  {
    is: "span",
    ml: 2,
    color: "rockmanBlue",
    fontSize: 0,
    fontWeight: 700
  },
  "space",
  "color",
  "fontSize",
  "fontWeight"
);

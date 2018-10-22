import React from "react";
import { Link } from "@reach/router";
import { Query } from "react-apollo";
import { Flex, Box, Text } from "rebass/emotion";
import system from "system-components/emotion";
import printIframe from "print-iframe";

import { Switch } from "@ehealth/components";
import { PrinterIcon } from "@ehealth/icons";

import Badge from "../../components/Badge";
import Button from "../../components/Button";
import LinkComponent from "../../components/Link";
import Breadcrumbs from "../../components/Breadcrumbs";
import DefinitionListView from "../../components/DefinitionListView";

import ContractRequestQuery from "../../graphql/ContractRequestQuery.graphql";

const Details = ({ id }) => (
  <Query query={ContractRequestQuery} variables={{ id }}>
    {({ loading, error, data: { contractRequest } }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      const {
        id,
        databaseId,
        status,
        assignee,
        printoutContent: content
      } = contractRequest;

      return (
        <>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/contract-requests">
                  Перелік запитів
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>Деталі запиту</Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Flex
              justifyContent="space-between"
              flexDirection={status === "NEW" && "column"}
            >
              <Box>
                <DefinitionListView
                  labels={{
                    id: "ID запиту",
                    status: "Статус",
                    assignee: (assignee && "Виконавець") || undefined
                  }}
                  data={{
                    id: databaseId,
                    status: (
                      <Badge
                        name={status}
                        type="CONTRACT_REQUEST"
                        minWidth={100}
                      />
                    ),
                    assignee: (assignee && assignee.id) || undefined
                  }}
                  color="#7F8FA4"
                  labelWidth="100px"
                />
              </Box>
              <Switch
                value={status}
                NEW="Choose signer"
                IN_PROCESS={
                  <Flex alignItems="flex-end">
                    <Flex>
                      <Box mr={2}>
                        <Link to="decline">
                          <Button variant="red">Відхилити</Button>
                        </Link>
                      </Box>
                      <Link to="approve">
                        <Button variant="green">Затвердити</Button>
                      </Link>
                    </Flex>
                  </Flex>
                }
                PENDING_NHS_SIGN={
                  <Flex
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="flex-end"
                  >
                    <PrintButton content={content} />
                    <Link to="./print-out-content">
                      <Button variant="red">Розірвати контракт</Button>
                    </Link>
                  </Flex>
                }
                default={<PrintButton content={content} />}
              />
            </Flex>
          </Box>
        </>
      );
    }}
  </Query>
);

const PrintButton = ({ content, ...props }) => (
  <Wrapper color="shiningKnight" onClick={() => printIframe(content)}>
    <Text color="rockmanBlue" fontWeight="bold" mr={1} fontSize="1">
      Дивитись друковану форму
    </Text>
    <PrinterIcon />
  </Wrapper>
);

const Wrapper = system(
  {
    is: Flex
  },
  { cursor: "pointer" }
);

export default Details;

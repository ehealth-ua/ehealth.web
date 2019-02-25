import React from "react";
import { Query, Mutation } from "react-apollo";
import { Router, Link } from "@reach/router";
import { Flex, Box, Text } from "@rebass/emotion";
import { loader } from "graphql.macro";
import { Trans } from "@lingui/macro";
import { getFullName } from "@ehealth/utils";
import { LocationParams, Form, Validation } from "@ehealth/components";
import { SearchIcon, PositiveIcon, NegativeIcon } from "@ehealth/icons";
import { Signer } from "@ehealth/react-iit-digital-signature";

import Line from "../../components/Line";
import Badge from "../../components/Badge";
import Table from "../../components/Table";
import Steps from "../../components/Steps";
import Button from "../../components/Button";
import LoadingOverlay from "../../components/LoadingOverlay";
import Tooltip from "../../components/Tooltip";
import * as Field from "../../components/Field";
import DictionaryValue from "../../components/DictionaryValue";
import DefinitionListView from "../../components/DefinitionListView";

import env from "../../env";

const LegalEntityQuery = loader("../../graphql/LegalEntityQuery.graphql");
const SearchLegalEntitiesQuery = loader(
  "../../graphql/SearchLegalEntitiesQuery.graphql"
);
const MergeLegalEntitiesMutation = loader(
  "../../graphql/MergeLegalEntitiesMutation.graphql"
);

const Add = ({ location: { state } }) => (
  <>
    <Box pt={5} px={5}>
      <Steps.List>
        <Steps.Item to="./" state={state}>
          <Trans>Find Legal entity</Trans>
        </Steps.Item>
        <Steps.Item
          to="./reason"
          state={state}
          disabled={state && !state.reason}
        >
          <Trans>Specify the basis</Trans>
        </Steps.Item>
        <Steps.Item to="./sign" state={state} disabled={state && !state.reason}>
          <Trans>Confirm with EDS</Trans>
        </Steps.Item>
      </Steps.List>
    </Box>
    <Router>
      <Search path="/" />
      <Reason path="/reason" />
      <Sign path="/sign" />
    </Router>
  </>
);

const Search = ({ location: { state } }) => (
  <LocationParams>
    {({ locationParams: { filter, orderBy }, setLocationParams }) => (
      <>
        <Form onSubmit={setLocationParams} initialValues={{ filter, orderBy }}>
          <Box px={5} width={460}>
            <Trans
              id="Enter legal entity EDRPOU"
              render={({ translation }) => (
                <Field.Text
                  name="filter.edrpou"
                  label={<Trans>Find related legal entity</Trans>}
                  placeholder={translation}
                  postfix={<SearchIcon color="silverCity" />}
                />
              )}
            />
          </Box>
        </Form>
        {filter && (
          <Query
            query={SearchLegalEntitiesQuery}
            variables={{ filter, first: 1 }}
          >
            {({
              loading,
              error,
              data: { legalEntities: { nodes: legalEntities = [] } = {} } = {}
            }) => {
              if (error) return `Error! ${error.message}`;
              const [legalEntity] = legalEntities;
              return (
                <LoadingOverlay loading={loading}>
                  {legalEntities.length ? (
                    <>
                      <Table
                        data={legalEntities}
                        header={{
                          databaseId: <Trans>Legal entity ID</Trans>,
                          name: <Trans>Legal entity name</Trans>,
                          edrpou: <Trans>EDRPOU</Trans>,
                          owner: <Trans>CEO</Trans>,
                          type: <Trans>Type</Trans>,
                          nhsVerified: <Trans>Verified by NZZU</Trans>,
                          status: <Trans>Status</Trans>
                        }}
                        renderRow={({
                          status,
                          nhsVerified,
                          owner,
                          type,
                          ...legalEntity
                        }) => ({
                          ...legalEntity,
                          type: (
                            <DictionaryValue
                              name="LEGAL_ENTITY_TYPE"
                              item={type}
                            />
                          ),
                          owner: owner && getFullName(owner.party),
                          nhsVerified: (
                            <Flex justifyContent="center">
                              {nhsVerified ? (
                                <PositiveIcon />
                              ) : (
                                <NegativeIcon />
                              )}
                            </Flex>
                          ),
                          status: (
                            <Badge
                              name={status}
                              type="LEGALENTITY"
                              display="block"
                            />
                          )
                        })}
                        tableName="legalEntity/Add"
                      />
                      <Flex px={5} mt={5}>
                        <Box mr={3}>
                          <Link to="../related-legal-entities">
                            <Button variant="blue">
                              <Trans>Return</Trans>
                            </Button>
                          </Link>
                        </Box>
                        <Link to="./reason" state={{ legalEntity, ...state }}>
                          <Button variant="green">
                            <Trans>Next</Trans>
                          </Button>
                        </Link>
                      </Flex>
                    </>
                  ) : null}
                </LoadingOverlay>
              );
            }}
          </Query>
        )}
      </>
    )}
  </LocationParams>
);

const Reason = ({
  navigate,
  location: {
    state: {
      reason,
      legalEntity: { owner, databaseId, name, edrpou }
    }
  }
}) => (
  <Box pt={1} px={5}>
    <Text fontSize={1} fontWeight="bold" mb={3}>
      <Trans>Related legal entity</Trans>
    </Text>
    <DefinitionListView
      labels={{
        edrpou: <Trans>EDRPOU</Trans>,
        name: <Trans>Name</Trans>,
        owner: <Trans>Owner</Trans>
      }}
      data={{
        edrpou,
        name
        // owner: getFullName(owner.party)
      }}
    />
    <DefinitionListView
      labels={{
        databaseId: <Trans>Legal entity ID</Trans>
      }}
      data={{
        databaseId
      }}
      color="#7F8FA4"
    />
    <Box width={460} pt={2}>
      <Form
        onSubmit={async ({ reason }) => {
          navigate("../sign", {
            state: { reason, legalEntity: { owner, databaseId, name, edrpou } }
          });
        }}
        initialValues={{ reason }}
      >
        <Trans
          id="Example: Order of the Cabinet of Ministers of Ukraine # 73465 "
          render={({ translation }) => (
            <Field.Textarea
              name="reason"
              rows={6}
              label={<Trans>Specify the merge reason</Trans>}
              placeholder={translation}
            />
          )}
        />
        <Validation.Required field="reason" message="Required field" />
        <Flex>
          <Box mr={3}>
            <Link
              to="../"
              state={{
                reason,
                legalEntity: { owner, databaseId, name, edrpou }
              }}
            >
              <Button variant="blue">
                <Trans>Return</Trans>
              </Button>
            </Link>
          </Box>
          <Button variant="green">
            <Trans>Next</Trans>
          </Button>
        </Flex>
      </Form>
    </Box>
  </Box>
);

const Sign = ({
  id: legalEntityToId,
  location: {
    state: {
      reason,
      legalEntity: {
        databaseId: legalEntityFromId,
        name: legalEntityFromName,
        edrpou: legalEntityFromEdrpou,
        owner
      }
    }
  },
  navigate
}) => (
  <Query
    query={LegalEntityQuery}
    variables={{ id: legalEntityToId, first: 10 }}
  >
    {({
      loading,
      error,
      data: { legalEntity: { databaseId, name, edrpou } = {} } = {}
    }) => {
      if (error) return `Error! ${error.message}`;
      const legalEntityTo = { id: databaseId, name, edrpou };
      const legalEntityFrom = {
        id: legalEntityFromId,
        name: legalEntityFromName,
        edrpou: legalEntityFromEdrpou
      };
      return (
        <LoadingOverlay loading={loading}>
          <Box px={5}>
            <Signer.Parent
              url={env.REACT_APP_SIGNER_URL}
              features={{ width: 640, height: 589 }}
            >
              {({ signData }) => (
                <Mutation mutation={MergeLegalEntitiesMutation}>
                  {mergeLegalEntities => (
                    <>
                      <Text fontSize={1} fontWeight="bold" mb={3}>
                        <Trans>Main legal entity</Trans>
                      </Text>
                      <DefinitionListView
                        labels={{
                          edrpou: <Trans>EDRPOU</Trans>,
                          name: <Trans>Name</Trans>,
                          id: <Trans>Legal entity ID</Trans>
                        }}
                        data={legalEntityTo}
                      />
                      <Line />
                      <Text fontSize={1} fontWeight="bold" mb={3}>
                        <Trans>Related legal entity</Trans>
                      </Text>
                      <DefinitionListView
                        labels={{
                          edrpou: <Trans>EDRPOU</Trans>,
                          name: <Trans>Name</Trans>,
                          id: <Trans>Legal entity ID</Trans>
                        }}
                        data={legalEntityFrom}
                      />
                      <Line />
                      <DefinitionListView
                        labels={{
                          reason: <Trans>Merge Legal entity reason</Trans>
                        }}
                        data={{ reason }}
                      />
                      <Flex>
                        <Box mr={3}>
                          <Link
                            to="../reason"
                            state={{
                              reason,
                              legalEntity: {
                                id: legalEntityFromId,
                                name: legalEntityFromName,
                                edrpou: legalEntityFromEdrpou,
                                owner
                              }
                            }}
                          >
                            <Button variant="blue">
                              <Trans>Return</Trans>
                            </Button>
                          </Link>
                        </Box>
                        <Tooltip
                          component={() => (
                            <Button
                              variant="green"
                              onClick={async () => {
                                const mergedLegalEntities = {
                                  merged_from_legal_entity: legalEntityFrom,
                                  merged_to_legal_entity: legalEntityTo,
                                  reason
                                };
                                const { signedContent } = await signData(
                                  mergedLegalEntities
                                );
                                await mergeLegalEntities({
                                  variables: {
                                    input: {
                                      signedContent: {
                                        content: signedContent,
                                        encoding: "BASE64"
                                      }
                                    }
                                  }
                                });
                                await navigate("/legal-entity-merge-jobs");
                              }}
                            >
                              <Trans>Sign</Trans>
                            </Button>
                          )}
                          content={
                            <Trans>
                              Warning!
                              <br />
                              By approving the request, CONFIRMS the validity of
                              their own intentions, and also that the content of
                              the transaction is in accordance with your
                              authority, accepted and signed personally by you.
                            </Trans>
                          }
                        />
                      </Flex>
                    </>
                  )}
                </Mutation>
              )}
            </Signer.Parent>
          </Box>
        </LoadingOverlay>
      );
    }}
  </Query>
);

export default Add;

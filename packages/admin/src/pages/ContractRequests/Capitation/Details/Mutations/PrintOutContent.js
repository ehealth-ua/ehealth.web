import React from "react";
import { Query, Mutation } from "react-apollo";
import { Link } from "@reach/router";
import { Switch } from "@ehealth/components";
import printIframe from "print-iframe";
import { loader } from "graphql.macro";
import { Trans } from "@lingui/macro";
import system from "@ehealth/system-components";
import { Box, Flex, Text } from "@rebass/emotion";
import { PrinterIcon } from "@ehealth/icons";
import { Signer } from "@ehealth/react-iit-digital-signature";

import LoadingOverlay from "../../../../../components/LoadingOverlay";
import Button from "../../../../../components/Button";
import InfoBox from "../../../../../components/InfoBox";
import env from "../../../../../env";

import { CapitationContractRequestQuery } from "../";

const SignContractRequestMutation = loader(
  "../../../../../graphql/SignContractRequestMutation.graphql"
);

const PrintOutContent = ({ id, navigate, ...props }) => {
  return (
    <Query
      query={CapitationContractRequestQuery}
      variables={{
        id
      }}
    >
      {({
        loading,
        error,
        data: {
          capitationContractRequest: {
            printoutContent: content,
            status,
            toSignContent,
            contractorLegalEntity
          } = {}
        } = {}
      }) => {
        if (error) return `Error! ${error.message}`;
        const isSignDisabled =
          contractorLegalEntity && contractorLegalEntity.status !== "ACTIVE";
        return (
          <LoadingOverlay loading={loading}>
            <Portal content={content} />
            <FixedWrapper>
              <Flex
                width="720"
                justifyContent="space-between"
                alignItems="center"
                mx="auto"
              >
                <Flex>
                  <Link to="../">
                    <Button mr="2" variant="blue">
                      <Trans>Back</Trans>
                    </Button>
                  </Link>
                  <Switch
                    value={status}
                    PENDING_NHS_SIGN={
                      <Signer.Parent
                        url={env.REACT_APP_STAMP_URL}
                        features={{
                          width: 640,
                          height: 670
                        }}
                      >
                        {({ signData }) => (
                          <Mutation
                            mutation={SignContractRequestMutation}
                            refetchQueries={() => [
                              {
                                query: CapitationContractRequestQuery,
                                variables: { id }
                              }
                            ]}
                          >
                            {signContractRequest => (
                              <>
                                <Button
                                  variant="green"
                                  disabled={isSignDisabled}
                                  onClick={async () => {
                                    const { signedContent } = await signData(
                                      toSignContent
                                    );
                                    await signContractRequest({
                                      variables: {
                                        input: {
                                          id,
                                          signedContent: {
                                            content: signedContent,
                                            encoding: "BASE64"
                                          }
                                        }
                                      }
                                    });
                                    await navigate("../");
                                  }}
                                >
                                  <Trans>Signing by EDS and seal</Trans>
                                </Button>
                                {isSignDisabled && (
                                  <InfoBox variant="horizontal">
                                    <Trans>
                                      It is impossible to sign the contract
                                      request, because the legal entity is
                                      inactive.
                                    </Trans>
                                  </InfoBox>
                                )}
                              </>
                            )}
                          </Mutation>
                        )}
                      </Signer.Parent>
                    }
                  />
                </Flex>

                <Button
                  variant="none"
                  outline="none"
                  border="0"
                  onClick={async () => {
                    await printIframe(content);
                  }}
                >
                  <Flex color="shiningKnight">
                    <Text
                      fontWeight="bold"
                      mr={1}
                      fontSize="1"
                      color="rockmanBlue"
                    >
                      <Trans>Print</Trans>
                    </Text>
                    <PrinterIcon color="shiningKnight" />
                  </Flex>
                </Button>
              </Flex>
            </FixedWrapper>
          </LoadingOverlay>
        );
      }}
    </Query>
  );
};

const Wrapper = system(
  {},
  {
    position: "relative",
    overflow: "hidden",
    height: "calc(100vh - 90px)"
  }
);

const FixedWrapper = system(
  {
    extend: Box,
    p: 2,
    bg: "white",
    borderColor: "silverCity"
  },
  {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    borderTop: "1px solid",
    boxShadow: "0 0 18px rgba(174, 174, 174, 0.75)"
  },
  "space",
  "color",
  "borderColor"
);

const Frame = system(
  { is: "iframe" },
  {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    border: 0
  }
);

const Portal = ({ content }) => (
  <Wrapper>
    <Frame srcDoc={content} />
  </Wrapper>
);

export default PrintOutContent;

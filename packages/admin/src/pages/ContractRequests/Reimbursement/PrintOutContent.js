import React from "react";
import { Query, Mutation } from "react-apollo";
import { Link } from "@reach/router";
import { Switch } from "@ehealth/components";
import printIframe from "print-iframe";
import { loader } from "graphql.macro";
import { Trans } from "@lingui/macro";
import system from "system-components/emotion";
import { Box, Flex, Text } from "rebass/emotion";
import { PrinterIcon } from "@ehealth/icons";
import { Signer } from "@ehealth/react-iit-digital-signature";

import LoadingOverlay from "../../../components/LoadingOverlay";
import Button from "../../../components/Button";
import env from "../../../env";

const SignContractRequestMutation = loader(
  "../../../graphql/SignContractRequestMutation.graphql"
);
const ReimbursementContractRequestQuery = loader(
  "../../../graphql/ReimbursementContractRequestQuery.graphql"
);

const PrintOutContent = ({ id, navigate, ...props }) => {
  return (
    <Query
      query={ReimbursementContractRequestQuery}
      variables={{
        id
      }}
    >
      {({
        loading,
        error,
        data: {
          reimbursementContractRequest: {
            printoutContent: content,
            status,
            toSignContent
          } = {}
        } = {}
      }) => {
        if (error) return `Error! ${error.message}`;
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
                <Box>
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
                                query: ReimbursementContractRequestQuery,
                                variables: { id }
                              }
                            ]}
                          >
                            {signContractRequest => (
                              <Button
                                variant="green"
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
                                  navigate("../");
                                }}
                              >
                                <Trans>Signing by EDS and seal</Trans>
                              </Button>
                            )}
                          </Mutation>
                        )}
                      </Signer.Parent>
                    }
                  />
                </Box>

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

const Wrapper = system({
  position: "relative",
  overflow: "hidden",
  height: "calc(100vh - 90px)"
});

const FixedWrapper = system({
  is: Box,
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  p: 2,
  background: "white",
  borderTop: "1px solid",
  borderColor: "silverCity",
  boxShadow: "0 0 18px rgba(174, 174, 174, 0.75)"
});

const Frame = system({
  is: "iframe",
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  border: 0
});

const Portal = ({ content }) => (
  <Wrapper position="relative">
    <Frame srcDoc={content} />
  </Wrapper>
);

export default PrintOutContent;
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Query, Mutation } from "react-apollo";
import { Link } from "@reach/router";
import { Switch } from "@ehealth/components";
import printIframe from "print-iframe";

import { PrinterIcon } from "@ehealth/icons";
import LinkComponent from "../../components/Link";
import system from "system-components/emotion";
import { Box, Flex, Text } from "rebass/emotion";
import { Signer } from "@ehealth/react-iit-digital-signature";
import Button from "../../components/Button";

import ContractRequestQuery from "../../graphql/ContractRequestQuery.graphql";
import SignContractRequestMutation from "../../graphql/SignContractRequestMutation.graphql";

import { REACT_APP_STAMP_URL } from "../../env";

const PrintOutContent = ({ id, navigate, ...props }) => {
  return (
    <Query
      query={ContractRequestQuery}
      variables={{
        id
      }}
    >
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        const {
          contractRequest: { printoutContent: content, status, toSignContent }
        } = data;
        return (
          <>
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
                      Повернутись
                    </Button>
                  </Link>
                  <Switch
                    value={status}
                    PENDING_NHS_SIGN={
                      <Signer.Parent
                        url={REACT_APP_STAMP_URL}
                        features={{
                          width: 640,
                          height: 670
                        }}
                      >
                        {({ signData }) => (
                          <Mutation mutation={SignContractRequestMutation}>
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
                                Підписати, наклавши ЕЦП та Печатку
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
                      Роздрукувати
                    </Text>
                    <PrinterIcon color="shiningKnight" />
                  </Flex>
                </Button>
              </Flex>
            </FixedWrapper>
          </>
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

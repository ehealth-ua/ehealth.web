import React from "react";
import { Link } from "@reach/router";
import { Mutation } from "react-apollo";
import { BooleanValue } from "react-values";
import { Trans } from "@lingui/macro";
import { Flex, Box } from "@rebass/emotion";
import system from "@ehealth/system-components";
import { loader } from "graphql.macro";

import Button from "./Button";
import InfoBox from "./InfoBox";

import { Signer } from "@ehealth/react-iit-digital-signature";

import env from "../env";

const ApproveContractRequestMutation = loader(
  "../graphql/ApproveContractRequestMutation.graphql"
);

class SignContractRequest extends React.Component {
  infoBox = React.createRef();

  render() {
    const {
      id,
      data: { toApproveContent },
      navigate,
      query,
      isApproveDisabled
    } = this.props;

    return (
      <Signer.Parent
        url={env.REACT_APP_SIGNER_URL}
        features={{
          width: 640,
          height: 589
        }}
      >
        {({ signData }) => (
          <Mutation
            mutation={ApproveContractRequestMutation}
            refetchQueries={() => [
              {
                query,
                variables: { id }
              }
            ]}
          >
            {approveContractRequest => (
              <BooleanValue>
                {({ value: opened, toggle }) => (
                  <Flex mt={5}>
                    <Box mr={3}>
                      <Link to="../update">
                        <Button variant="blue">
                          <Trans>Return</Trans>
                        </Button>
                      </Link>
                    </Box>

                    <Box mr={3}>
                      <Button
                        variant="green"
                        disabled={isApproveDisabled}
                        onMouseOver={() => !opened && toggle()}
                        onClick={async () => {
                          opened && toggle();
                          const { signedContent } = await signData(
                            toApproveContent
                          );

                          await approveContractRequest({
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
                        <Trans>Approve by EDS</Trans>
                      </Button>
                      {isApproveDisabled && (
                        <InfoBox>
                          <Trans>
                            It is impossible to sign the contract request,
                            because the legal entity is inactive.
                          </Trans>
                        </InfoBox>
                      )}
                      <Box ref={this.infoBox}>
                        {opened && (
                          <>
                            {scrollTo(this.infoBox)}
                            <BorderBox>{toApproveContent.text}</BorderBox>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Flex>
                )}
              </BooleanValue>
            )}
          </Mutation>
        )}
      </Signer.Parent>
    );
  }
}

const scrollTo = target => {
  target.current.scrollIntoView({
    block: "start",
    behavior: "smooth"
  });
};

const BorderBox = system(
  {
    extend: Box,
    p: 4,
    my: 5,
    fontSize: 0,
    border: 1,
    borderColor: "januaryDawn"
  },
  {
    position: "relative",
    lineHeight: 1.5,
    "&::before": {
      content: '""',
      position: "absolute",
      display: "block",
      top: "-10px",
      left: "30px",
      width: "20px",
      height: "20px",
      border: "1px solid #dfe2e5",
      transform: "rotate(45deg)",
      clipPath: "polygon(100% 0,0 100%,0 0)",
      backgroundColor: "#fff"
    }
  },
  "space",
  "fontSize",
  "border",
  "borderColor"
);

export default SignContractRequest;

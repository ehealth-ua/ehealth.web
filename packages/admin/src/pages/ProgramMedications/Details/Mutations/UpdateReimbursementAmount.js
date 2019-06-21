//@flow
import React, { useState } from "react";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import { Flex, Box, Text } from "@rebass/emotion";
import { Form, Validation } from "@ehealth/components";
import { PositiveIcon, CancelIcon } from "@ehealth/icons";

import type { Scalars, ProgramMedication } from "@ehealth-ua/schema";

import Price from "../../../../components/Price";
import Button from "../../../../components/Button";
import * as Field from "../../../../components/Field";

import { UpdateProgramMedicationMutation } from "./Update";

const UpdateReimbursementAmount = ({
  id,
  reimbursementAmount
}: {
  id: Scalars.ID,
  reimbursementAmount: ProgramMedication.reimbursementAmount
}) => {
  const [isFormVisible, setPopupVisibility] = useState(false);
  const toggle = () => setPopupVisibility(!isFormVisible);

  return isFormVisible ? (
    <Mutation mutation={UpdateProgramMedicationMutation}>
      {updateProgramMedication => (
        <Form
          onSubmit={async ({ reimbursementAmount }) => {
            const amount = parseFloat(reimbursementAmount);
            await updateProgramMedication({
              variables: {
                input: {
                  id,
                  reimbursement: {
                    reimbursementAmount: amount
                  }
                }
              }
            });
            toggle();
          }}
          initialValues={{ reimbursementAmount }}
        >
          <Flex>
            <Field.Number
              name="reimbursementAmount"
              value={reimbursementAmount}
              placeholder="0 - 1 000 000"
              postfix={<Trans>uah</Trans>}
            />
            <Validation.Required
              field="reimbursementAmount"
              message="Required field"
            />
            <Box mx={2} color="redPigment">
              <Button
                variant="none"
                border="none"
                px="0"
                type="reset"
                onClick={toggle}
              >
                <CancelIcon />
              </Button>
            </Box>
            <Box>
              <Button variant="none" border="none" px="0">
                <PositiveIcon />
              </Button>
            </Box>
          </Flex>
        </Form>
      )}
    </Mutation>
  ) : (
    <Flex>
      <Price amount={reimbursementAmount} />
      <Button variant="none" border="none" px="0" py="0" onClick={toggle}>
        <Text fontSize={0} color="rockmanBlue" fontWeight="bold" ml={2}>
          <Trans>Change</Trans>
        </Text>
      </Button>
    </Flex>
  );
};

export default UpdateReimbursementAmount;

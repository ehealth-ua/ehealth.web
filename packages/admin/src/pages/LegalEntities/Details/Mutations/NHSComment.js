//@flow
import React from "react";
import gql from "graphql-tag";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import { Form } from "@ehealth/components";
import { Box, Flex } from "@rebass/emotion";
import system from "@ehealth/system-components";
import { CommentIcon } from "@ehealth/icons";
import * as Field from "../../../../components/Field";
import Button, { IconButton } from "../../../../components/Button";
import Popup from "../../../../components/Popup";

import type { Scalars, LegalEntity } from "@ehealth-ua/schema";

const NHSComment = ({
  id,
  nhsComment
}: {
  id: Scalars.ID,
  nhsComment: LegalEntity.nhsComment
}) => {
  const [isVisible, setVisibilityState] = React.useState(false);
  const toggle = () => setVisibilityState(!isVisible);
  const [isFormVisible, setFormVisibility] = React.useState(!nhsComment);
  const toggleForm = () => setFormVisibility(!isFormVisible);
  return (
    <Mutation mutation={NhsCommentLegalEntityMutation}>
      {nhsCommentLegalEntity => (
        <>
          <CommentButton nhsComment={nhsComment} toggle={toggle} />
          <Popup
            visible={isVisible}
            okText={<ButtonText nhsComment={nhsComment} />}
            okButtonProps={{ type: "submit", variant: "green" }}
            onCancel={toggle}
            title={<Title nhsComment={nhsComment} />}
            formId="nhsCommentForm"
            justifyButtons="left"
            renderFooter={({
              onCancel,
              cancelButtonProps,
              cancelText,
              okButtonProps,
              onOk,
              okText,
              justifyButtons,
              formId
            }) =>
              isFormVisible ? (
                <Flex justifyContent={justifyButtons} as="footer">
                  <Box mr={20}>
                    <Button onClick={onCancel} {...cancelButtonProps}>
                      {cancelText}
                    </Button>
                  </Box>
                  <Button {...okButtonProps} onClick={onOk} form={formId}>
                    {okText}
                  </Button>
                </Flex>
              ) : (
                <Flex justifyContent={justifyButtons} as="footer">
                  <Box mr={20}>
                    <Button onClick={onCancel} {...cancelButtonProps}>
                      {cancelText}
                    </Button>
                  </Box>
                  <Box mr={20}>
                    <Button
                      variant="red"
                      onClick={async () => {
                        await nhsCommentLegalEntity({
                          variables: {
                            input: { id, nhsComment: "" }
                          }
                        });
                        toggle();
                        toggleForm();
                      }}
                    >
                      <Trans>Delete</Trans>
                    </Button>
                  </Box>
                  <Button variant="green" onClick={toggleForm}>
                    <Trans>Edit comment</Trans>
                  </Button>
                </Flex>
              )
            }
          >
            {isFormVisible ? (
              <Form
                onSubmit={async ({ nhsComment = "" }) => {
                  await nhsCommentLegalEntity({
                    variables: { input: { id, nhsComment } }
                  });
                  toggle();
                  toggleForm();
                }}
                initialValues={{ nhsComment }}
                id="nhsCommentForm"
              >
                <Trans
                  id="Enter comment"
                  render={({ translation }) => (
                    <Field.Textarea
                      name="nhsComment"
                      placeholder={translation}
                      rows={5}
                      maxLength="3000"
                      showLengthHint
                    />
                  )}
                />
              </Form>
            ) : (
              <CommentBox>{nhsComment}</CommentBox>
            )}
          </Popup>
          {nhsComment && <BorderBox>{nhsComment}</BorderBox>}
        </>
      )}
    </Mutation>
  );
};

const CommentButton = ({
  nhsComment,
  toggle
}: {
  nhsComment: LegalEntity.nhsComment,
  toggle: () => mixed
}) => (
  <IconButton icon={CommentIcon} onClick={toggle}>
    <ButtonText nhsComment={nhsComment} />
  </IconButton>
);

const ButtonText = ({ nhsComment }: { nhsComment: LegalEntity.nhsComment }) =>
  nhsComment ? <Trans>Edit comment</Trans> : <Trans>Leave a Comment</Trans>;

const Title = ({ nhsComment }: { nhsComment: LegalEntity.nhsComment }) =>
  nhsComment ? <Trans>Comment</Trans> : <Trans>Leave a Comment</Trans>;

const NhsCommentLegalEntityMutation = gql`
  mutation NhsCommentLegalEntityMutation($input: NhsCommentLegalEntityInput!) {
    legalEntity: nhsCommentLegalEntity(input: $input) {
      legalEntity {
        id
        nhsComment
      }
    }
  }
`;

const CommentBox = system(
  {
    extend: Box,
    pt: 2,
    pb: 5
  },
  `
    white-space: pre-line;
  `,
  "space"
);

const BorderBox = system(
  {
    extend: Box,
    p: 4,
    mb: 5,
    fontSize: 0,
    border: 1,
    borderColor: "januaryDawn"
  },
  {
    lineHeight: 1.5,
    maxHeight: 200
  },
  `
    white-space: pre-line;
    overflow-y: scroll;
  `,
  "space",
  "fontSize",
  "border",
  "borderColor"
);

export default NHSComment;

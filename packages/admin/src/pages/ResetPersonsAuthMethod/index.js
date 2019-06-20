//@flow
import * as React from "react";
import gql from "graphql-tag";
import Papa from "papaparse";
import isEmpty from "lodash/isEmpty";
import Dropzone from "react-dropzone";
import { Trans } from "@lingui/macro";
import { Mutation } from "react-apollo";
import { Box, Heading, Text } from "@rebass/emotion";
import system from "@ehealth/system-components";
import Button from "../../components/Button";
import { UUID_PATTERN } from "../../constants/validationPatterns";

const ONE_MB = 1048576;

const ResetPersonsAuthMethod = ({
  navigate
}: {
  navigate: string => mixed
}) => {
  const [fileContent, setFileContent] = React.useState({
    validEntries: [],
    invalidEntries: []
  });
  const [isLoading, setLoading] = React.useState(false);

  return (
    <Box p={6}>
      <Heading as="h1" fontWeight="normal" mb={4}>
        <Trans>Reset persons authentication method</Trans>
      </Heading>
      <Mutation mutation={ResetPersonsAuthenticationMethodMutation}>
        {resetPersonsAuth => (
          <>
            <Dropzone
              multiple={false}
              accept=".csv"
              maxSize={ONE_MB}
              onDrop={acceptedFiles => {
                const reader = new FileReader();
                reader.onloadstart = () => setLoading(true);
                reader.onloadend = () => setLoading(false);
                reader.onload = () => {
                  const parseResult = Papa.parse(reader.result);
                  const validEntries: string[] = parseResult.data
                    .flat()
                    .filter(e => new RegExp(UUID_PATTERN).test(e));
                  const invalidEntries: string[] = parseResult.data
                    .flat()
                    .filter(e => !new RegExp(UUID_PATTERN).test(e));

                  setFileContent({
                    validEntries,
                    invalidEntries
                  });
                };
                acceptedFiles.forEach(file => reader.readAsBinaryString(file));
              }}
            >
              {({
                acceptedFiles,
                getRootProps,
                getInputProps,
                rejectedFiles
              }) => {
                const [fileSizeError] = rejectedFiles.map(
                  file => file.size > ONE_MB
                );

                return (
                  <>
                    <DropzoneView {...getRootProps()}>
                      <input {...getInputProps()} />
                      {!isEmpty(acceptedFiles) ? (
                        <FileName files={acceptedFiles} />
                      ) : !isEmpty(rejectedFiles) ? (
                        <FileName files={rejectedFiles} />
                      ) : (
                        <Trans>
                          Drag 'n' drop file here, or click to select file
                        </Trans>
                      )}
                    </DropzoneView>
                    {fileSizeError && (
                      <Text color="red" fontSize={1} mb={2}>
                        <Trans>File size more than 1MB</Trans>
                      </Text>
                    )}
                    {!isEmpty(fileContent.invalidEntries) && (
                      <InvalidEntriesList
                        invalidEntries={fileContent.invalidEntries}
                      />
                    )}
                    <Button
                      variant="green"
                      disabled={
                        isLoading ||
                        fileSizeError ||
                        !isEmpty(fileContent.invalidEntries)
                      }
                      onClick={async () => {
                        await resetPersonsAuth({
                          input: {
                            variables: {
                              input: {
                                ids: fileContent && fileContent.validEntries
                              }
                            }
                          }
                        });
                        await navigate("/reset-persons-auth-method-jobs");
                      }}
                    >
                      <Trans>Reset authentication method</Trans>
                    </Button>
                  </>
                );
              }}
            </Dropzone>
          </>
        )}
      </Mutation>
    </Box>
  );
};

const FileName = ({ files }: { files: any[] }) =>
  files.map((file, i) => (
    <div key={i}>
      {file.path} - {file.size} bytes
    </div>
  ));

const InvalidEntriesList = ({
  invalidEntries
}: {
  invalidEntries: string[]
}) => (
  <Box mb={3}>
    <Text fontWeight="bold" fontSize={2}>
      <Trans>Invalid fields</Trans>
    </Text>
    <Box
      as="ul"
      mt={1}
      style={{
        maxHeight: 200,
        overflow: "auto"
      }}
    >
      {invalidEntries.map(item => (
        <Box as="li" key={item}>
          <Text color="#333" fontSize={0} mt={1}>
            {item}
          </Text>
        </Box>
      ))}
    </Box>
  </Box>
);

const DropzoneView = system(
  {
    borderColor: "#eee"
  },
  {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "200px",
    padding: "20px",
    marginBottom: "20px",
    borderWidth: "2px",
    borderRadius: "2px",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out"
  },
  `
    &:focus {
      border-color: #2196f3;
    }
  `
);

const ResetPersonsAuthenticationMethodMutation = gql`
  mutation ResetPersonsAuthMutation($input: ResetPersonsAuthInput!) {
    resetPersonsAuth(input: $input) {
      personsAuthResetJob {
        id
      }
    }
  }
`;

export default ResetPersonsAuthMethod;

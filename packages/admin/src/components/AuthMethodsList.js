import React from "react";
import { Flex, Box } from "@rebass/emotion";
import DictionaryValue from "./DictionaryValue";

const AuthMethodsList = ({ data }) => (
  <Flex as="ul" flexDirection="column">
    {data.map(({ type, phoneNumber }, idx) => (
      <Box
        key={idx}
        as="li"
        mb={1}
        css={{ "&:last-child": { marginBottom: 0 } }}
      >
        {type !== "NA" ? (
          <>
            <div>
              <DictionaryValue name="AUTHENTICATION_METHOD" item={type} />
            </div>
            {phoneNumber && <div>{phoneNumber}</div>}
          </>
        ) : (
          "—"
        )}
      </Box>
    ))}
  </Flex>
);

export default AuthMethodsList;

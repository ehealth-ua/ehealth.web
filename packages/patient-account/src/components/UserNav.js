import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { Match } from "@reach/router";
import { Tooltip, Link } from "@ehealth/components";
import { getFullName } from "@ehealth/utils";

import PersonQuery from "../graphql/PersonQuery.graphql";

const UserNav = () => (
  <Query query={PersonQuery}>
    {({ loading, error, data: { person } }) => {
      if (loading || error) return null;

      return (
        <Tooltip
          renderParent={({ getProps }) => (
            <UserNavWrapper {...getProps({ refKey: "innerRef" })}>
              <User>{getFullName(person.data)}</User>
            </UserNavWrapper>
          )}
          renderOverlay={({ active, getProps }) =>
            active && (
              <Menu {...getProps()}>
                <Match path="/profile">
                  {({ match }) => (
                    <MenuItem to="/profile" bold={match} color="black">
                      Мій профіль
                    </MenuItem>
                  )}
                </Match>
                <Match path="/security">
                  {({ match }) => (
                    <MenuItem to="/security" bold={match} color="black">
                      Безпека
                    </MenuItem>
                  )}
                </Match>
                <MenuItem href="/auth/logout" bold upperCase>
                  Вийти
                </MenuItem>
              </Menu>
            )
          }
        />
      );
    }}
  </Query>
);

export default UserNav;

const UserNavWrapper = styled.div`
  position: relative;
`;

const User = styled.div`
  position: relative;
  padding-right: 15px;
  color: #4880ed;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;

  &::after {
    position: absolute;
    top: 4px;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 4px 4px 0 4px;
    border-color: #4880ed transparent transparent transparent;
    content: "";
  }
`;

const Menu = styled.div`
  min-width: 140px;
  margin-top: 20px;
  padding: 30px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const MenuItem = styled(Link)`
  display: block;
  white-space: nowrap;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
`;

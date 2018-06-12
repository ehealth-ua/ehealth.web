import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { Link, Tooltip } from "@ehealth/components";
import { getFullName } from "@ehealth/utils";

import PersonQuery from "../graphql/PersonQuery.graphql";

const UserNav = () => (
  <Query query={PersonQuery}>
    {({ loading, error, data }) => {
      if (loading || error) return null;

      const { data: person } = data.person;

      return (
        <Tooltip
          renderParent={({ getProps }) => (
            <UserNavWrapper {...getProps({ refKey: "innerRef" })}>
              <User>{getFullName(user)}</User>
            </UserNavWrapper>
          )}
          renderOverlay={({ active, getProps }) =>
            active && (
              <Menu {...getProps()}>
                <MenuItem to="/profile" color="black">
                  Мій профіль
                </MenuItem>
                <MenuItem to="/security" color="black">
                  Безпека
                </MenuItem>
                <MenuItem to="/logout" bold>
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
  padding: 10px 30px 30px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const MenuItem = styled(Link)`
  display: block;
  white-space: nowrap;
  margin-top: 20px;
`;

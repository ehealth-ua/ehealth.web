import React from "react";
import styled from "react-emotion/macro";
import { EhealthLogoIcon } from "@ehealth/icons";
import UserNav from "./UserNav";

const Layout = ({ children }) => (
  <>
    <Wrapper>
      <Header>
        <EhealthLogoIcon height="45" />
        <UserNav />
      </Header>
      <section>{children}</section>
    </Wrapper>
    <Footer>©{new Date().getFullYear()} Всі права захищені</Footer>
  </>
);

export default Layout;

const Wrapper = styled.section`
  max-width: 960px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 50px 10px 0;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
`;

const Footer = styled.footer`
  flex: 0 0 40px;
  line-height: 40px;
  text-align: center;
  padding: 40px 0;
  border-top: 3px solid #a9da16;
`;

const User = styled.div`
  color: #4880ed;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
`;

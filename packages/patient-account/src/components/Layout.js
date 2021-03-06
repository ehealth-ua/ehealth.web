import React from "react";
import { Link } from "@reach/router";
import styled from "@emotion/styled";
import { EhealthLogoIcon } from "@ehealth/icons";
import UserNav from "./UserNav";

const Layout = ({ children }) => (
  <>
    <Wrapper>
      <Header>
        <Link to="/">
          <EhealthLogoIcon height="45" width="101" />
        </Link>
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

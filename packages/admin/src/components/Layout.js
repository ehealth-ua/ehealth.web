import React from "react";
import { Link } from "react-router-dom";
import styled from "react-emotion/macro";
import { EhealthLogoIcon } from "@ehealth/icons";

const Layout = ({ children }) => (
  <>
    <Wrapper>
      <Sidebar>
        <Link to="/">
          <Logo />
        </Link>
      </Sidebar>
      <Content>{children}</Content>
    </Wrapper>
  </>
);

export default Layout;

const Wrapper = styled.section`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  flex: 0 0 270px;
  padding: 30px;
  background-image: linear-gradient(0deg, #017696, #1c4886);
`;

const Content = styled.section`
  width: 100%;
  padding: 50px;
`;

const Logo = styled(EhealthLogoIcon)`
  display: flex;
  margin: 0 auto;
  height: 45px;
  width: 101px;
`;

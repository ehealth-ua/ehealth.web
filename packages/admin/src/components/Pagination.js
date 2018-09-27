import React from "react";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";
import { withProps } from "recompose";

import { stringifySearchParams } from "@ehealth/utils";
import { Pager, LocationParams, Link } from "@ehealth/components";

const Pagination = ({ totalPages }) => (
  <LocationParams>
    {({ locationParams: { page } }) => (
      <Pager currentPage={parseInt(page, 10)} totalPages={totalPages}>
        {({
          getPageProps,
          prevPage,
          currentPage,
          nextPage,
          leftPages,
          middlePages,
          rightPages,
          isFirstPage,
          isLastPage,
          isLeftRangeTruncated,
          isRightRangeTruncated
        }) => (
          <Container>
            <DirectionPage
              {...getPageProps({ page: prevPage }, true)}
              hide={isFirstPage}
              backward
            />
            {leftPages.map(page => (
              <Page
                {...getPageProps({ page, key: page }, true)}
                selected={page === currentPage}
              />
            ))}
            {isLeftRangeTruncated && <Delimiter />}
            {middlePages.map(page => (
              <Page
                {...getPageProps({ page, key: page }, true)}
                selected={page === currentPage}
              />
            ))}
            {isRightRangeTruncated && <Delimiter />}
            {rightPages.map(page => (
              <Page
                {...getPageProps({ page, key: page }, true)}
                selected={page === currentPage}
              />
            ))}
            <DirectionPage
              {...getPageProps({ page: nextPage }, true)}
              hide={isLastPage}
            />
          </Container>
        )}
      </Pager>
    )}
  </LocationParams>
);

export default Pagination;

const Page = ({ page, ...props }) => (
  <Item {...props}>
    <PageLink page={page} />
  </Item>
);

const DirectionPage = ({ page, backward, ...props }) => (
  <DirectionItem backward={backward} {...props}>
    <PageLink page={page}> </PageLink>
  </DirectionItem>
);

const PageLink = ({ page, children }) => (
  <LocationParams>
    {({ locationParams }) => (
      <Link to={{ search: stringifySearchParams({ ...locationParams, page }) }}>
        {children || page}
      </Link>
    )}
  </LocationParams>
);

const Container = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
  list-style: none;
`;

const Item = styled.li`
  border: 1px solid #e6eaee;
  min-width: 35px;
  height: 36px;
  margin-left: -1px;
  font-size: 14px;
  text-align: center;
  user-select: none;
  box-sizing: border-box;

  &:first-child {
    margin-left: 0;
  }

  a {
    text-align: center;
    text-decoration: none;
    color: ${ifProp("selected", "#354052", "#9a9fa8")};
    display: block;
    line-height: 34px;
    pointer-events: ${ifProp("selected", "none")};
  }
`;

const DirectionItem = styled(Item)`
  position: relative;
  visibility: ${props => props.hide && "hidden"};

  a {
    width: 100%;
    height: 100%;
  }

  a::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: ${ifProp("backward", "5px 6px 5px 0", "5px 0 5px 6px")};
    border-color: ${ifProp(
      "backward",
      "transparent #ced0da transparent transparent",
      "transparent transparent transparent #ced0da"
    )};
  }
`;

const Delimiter = withProps({
  children: "..."
})(styled(Item)`
  color: #ced0da;
  font-weight: 900;
  line-height: 35px;
`);

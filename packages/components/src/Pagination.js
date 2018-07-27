import React, { Component } from "react";
import Link from "./Link";
import styled from "react-emotion/macro";
import { withProps } from "recompose";
import { stringifySearchParams } from "@ehealth/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@ehealth/icons";

import SearchParams from "./SearchParams";
import Pager from "./Pager";

const Pagination = ({ totalPages }) => (
  <SearchParams>
    {({ searchParams: { page } }) => (
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
  </SearchParams>
);

export default Pagination;

const Page = ({ page, ...props }) => (
  <PageItem {...props}>
    <PageLink page={page} />
  </PageItem>
);

const DirectionPage = ({ page, backward, ...props }) => (
  <DirectionItem {...props}>
    <PageLink page={page}>
      {backward ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </PageLink>
  </DirectionItem>
);

const PageLink = ({ page, children }) => (
  <SearchParams>
    {({ searchParams }) => (
      <Link to={{ search: stringifySearchParams({ ...searchParams, page }) }}>
        {children || page}
      </Link>
    )}
  </SearchParams>
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
  margin-left: 10px;
  text-align: center;
  user-select: none;

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    font-weight: 700;
  }
`;

const PageItem = styled(Item)`
  background-color: ${props => props.selected && "#f7f6f6"};
  border: 1px solid ${props => (props.selected ? "#eee" : "#cbcbcb")};

  a {
    text-align: center;
    text-decoration: none;
    color: black;
    display: block;
    min-width: 26px;
    font-size: 12px;
    line-height: 20px;
    padding: 4px;
  }

  &:hover {
    border: 1px solid #eee;
  }
`;

const DirectionItem = styled(PageItem)`
  visibility: ${props => props.hide && "hidden"};

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 38px;
    height: 38px;
    width: 48px;
  }

  svg {
    height: 12px;
  }
`;

const Delimiter = withProps({
  children: "..."
})(
  styled(Item)`
    width: 34px;
  `
);

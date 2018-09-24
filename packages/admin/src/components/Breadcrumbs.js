import React from "react";
import * as Reach from "@reach/router";
import system from "system-components/emotion";
import { ChevronBottomIcon } from "@ehealth/icons";

/**
 * @example
 *
 * ```jsx
 * <Breadcrumbs.List>
 *  <Breadcrumbs.Item to="/">Пошук пацієнтів</Breadcrumbs.Item>
 *  <Breadcrumbs.Item>Деталі пацієнта</Breadcrumbs.Item>
 * </Breadcrumbs.List>
 * ```
 */

const Item = ({ to, ...props }) => (
  <Breadcrumb>
    {to ? (
      <>
        <Link to={to} {...props} />
        <Arrow />
      </>
    ) : (
      props.children
    )}
  </Breadcrumb>
);

const List = system({
  is: "ul",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  p: 0
});

const Breadcrumb = system({
  is: "li",
  fontSize: "14px",
  color: "#354052",
  mb: 2
});

const Link = system(
  {
    is: Reach.Link,
    color: "#848c98"
  },
  `
  text-decoration: none
`
);

const Arrow = system(
  {
    is: ChevronBottomIcon,
    color: "#a1a7af",
    mx: 2,
    verticalAlign: "middle"
  },
  `
    transform: rotate(270deg)
  `
);

const Breadcrumbs = { List, Item };

export default Breadcrumbs;

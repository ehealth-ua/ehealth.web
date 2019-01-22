import React from "react";
import * as Reach from "@reach/router";
import system from "@ehealth/system-components";
import { ChevronBottomIcon as Arrow } from "@ehealth/icons";

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
        <Arrow
          mx={2}
          verticalAlign="middle"
          css={{
            transform: "rotate(270deg)"
          }}
        />
      </>
    ) : (
      props.children
    )}
  </Breadcrumb>
);

const List = system(
  {
    is: "ul",
    p: 0
  },
  {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  "space"
);

const Breadcrumb = system(
  {
    is: "li",
    mb: 2,
    fontSize: 1,
    color: "darkAndStormy"
  },
  "space",
  "fontSize",
  "color"
);

const Link = system(
  {
    is: Reach.Link,
    color: "romanSilver"
  },
  {
    textDecoration: "none"
  },
  "color"
);

const Breadcrumbs = { List, Item };

export default Breadcrumbs;

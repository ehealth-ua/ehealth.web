// @flow

import * as React from "react";
import Cookie from "js-cookie";

type AbilityRenderProp = (able: boolean) => React.Node;

type AbilityProps = {|
  children?: React.Node | AbilityRenderProp,
  render?: AbilityRenderProp,
  scopes?: string[],
  scope?: string,
  resources?: string[],
  resource?: string,
  actions?: string[],
  action?: string,
  loose?: boolean
|};

type AbilityState = {|
  scopes?: string[]
|};

/**
 * Checks user's ability to perform the actions on the resources.
 *
 * @example Passing required actions and resources
 *
 * You can pass either single or multiple actions and resources or scopes:
 *
 * ```jsx
 * <Ability action="read" resource="contract">I can read contracts</Ability>
 * <Ability actions={["read", "write"]} resources={["contract", "declaration"]}>
 *   I can read and write contracts and declarations
 * </Ability>
 * <Ability scope="contract:read">I can read contracts</Ability>
 * <Ability scopes={["contract:read", "declaration:write"]}>
 *   I can read contracts and write declarations
 * </Ability>
 * ```

 * @example Using render props and rendering children nodes
 *
 * You can pass function to the `render` or `children` props to be called with
 * boolean value of ability to perform requested actions.
 *
 * ```jsx
 * <Ability action="read" resource="contract">
 *   {able => able ? "Yes, you can!" : "Nope, you cannot"}
 * </Ability>
 * ```
 *
 * Any valid React node passed as children will be rendered if user has
 * requested abilities:
 *
 * ```jsx
 * <Ability action="read" resource="contract">I can do this</Ability>
 * ```
 *
 * @example Loose scope matching
 *
 * Scopes can be matched loosely, with any matching scope will be returned
 * positive result:
 *
 * ```jsx
 * <Ability loose action="read" resources={["contract", "contract_request"]}>
 *  I can read contracts or contract requests!
 * </Ability>
 * ```
 */
class Ability extends React.Component<AbilityProps, AbilityState> {
  state = {
    scopes: undefined
  };

  componentDidMount() {
    const { scope = "" } = Cookie.getJSON("meta") || {};

    const scopes = scope.split(" ");

    this.setState({ scopes });
  }

  render() {
    if (!this.state.scopes) return null;

    const { children, render = children } = this.props;

    if (typeof render === "function") {
      return render(this.able);
    } else if (children) {
      return this.able ? children : null;
    } else {
      console.error(
        "Warning: You should specify either a render prop or pass node or a render function as children to Ability"
      );

      return null;
    }
  }

  get able(): boolean {
    const { loose } = this.props;
    const { scopes = [] } = this.state;

    const method = loose ? Array.prototype.some : Array.prototype.every;

    return method.call(this.requiredScopes, scope => scopes.includes(scope));
  }

  get requiredScopes(): string[] {
    const scopes = this.getArrayFromProps("scopes");

    if (scopes.length > 0) return scopes;

    const resources = this.getArrayFromProps("resources");
    const actions = this.getArrayFromProps("actions");

    return resources.reduce((prevScopes, resource) => {
      const scopes = actions.map(action => `${resource}:${action}`);
      return [...prevScopes, ...scopes];
    }, []);
  }

  getArrayFromProps(pluralPropName: string): string[] {
    // NOTE: This is poor man's singularize function, it works only with regular nouns.
    // Replace it with an inflection library when possible
    const singularPropName = pluralPropName.replace(
      /(\w+(?=ies$)|\w+(?:ss|x|ch|sh)(?=es$)|\w+(?=s$))(i)?\w+/,
      (_, word, suffix) => (suffix ? `${word}y` : word)
    );

    const { [pluralPropName]: array, [singularPropName]: value } = this.props;

    if (array) return array;
    if (value) return [value];
    return [];
  }
}

export default Ability;

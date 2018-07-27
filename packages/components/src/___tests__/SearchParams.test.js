import React from "react";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import SearchParams from "../SearchParams";

describe("SearchParams", () => {
  it("should render correctly", () => {
    const component = renderer.create(
      <MemoryRouter>
        <SearchParams>{() => <div />}</SearchParams>
      </MemoryRouter>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
  it("should return object in render prop", () => {
    const render = jest.fn(() => <div />);
    const component = renderer.create(
      <MemoryRouter>
        <SearchParams>{render}</SearchParams>
      </MemoryRouter>
    );
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toMatchSnapshot();
  });
});

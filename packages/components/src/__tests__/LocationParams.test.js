import React from "react";
import renderer from "react-test-renderer";
import LocationParams from "../LocationParams";

describe("LocationParams", () => {
  it("should render correctly", () => {
    const component = renderer.create(
      <LocationParams>{() => <div />}</LocationParams>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
  it("should return object in render prop", () => {
    const render = jest.fn(() => <div />);
    const component = renderer.create(
      <LocationParams>{render}</LocationParams>
    );
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toMatchSnapshot();
  });
});

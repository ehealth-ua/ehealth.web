import React from "react";
import { renderIntoDocument } from "react-dom/test-utils";

import Form from "../Form";
import Field from "../Field";

jest.mock("lodash/debounce", () => jest.fn(fn => fn));

const onSubmitMock = () => null;

describe("Form.AutoSubmit", () => {
  it("should warn error if not used inside a form", () => {
    const spy = jest
      .spyOn(global.console, "error")
      .mockImplementation(() => {});
    renderIntoDocument(<Form.AutoSubmit />);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      "Warning: FormSpy must be used inside of a ReactFinalForm component"
    );
    spy.mockRestore();
  });

  it("should hear changes", () => {
    const onSubmit = jest.fn();
    const input = jest.fn(({ input }) => <input {...input} />);
    renderIntoDocument(
      <Form onSubmit={onSubmitMock} initialValues={{ foo: "bar" }}>
        <Form.AutoSubmit onSubmit={onSubmit} />
        <Field.Input name="foo" render={input} />
      </Form>
    );
    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(input).toHaveBeenCalled();
    expect(input).toHaveBeenCalledTimes(1);
    expect(input.mock.calls[0][0].input.value).toBe("bar");

    // change value
    input.mock.calls[0][0].input.onChange("baz");

    expect(input).toHaveBeenCalledTimes(2);
    expect(input.mock.calls[1][0].input.value).toBe("baz");
  });

  it("should not render with render prop when given onSubmit", () => {
    const onSubmit = jest.fn();
    const render = jest.fn();
    renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        <Form.AutoSubmit onSubmit={onSubmit} render={render} />
      </Form>
    );
    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(render).not.toHaveBeenCalled();
  });

  it("should not render with child render prop when given onSubmit", () => {
    const onSubmit = jest.fn();
    const render = jest.fn();
    renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        <Form.AutoSubmit onSubmit={onSubmit}>{render}</Form.AutoSubmit>
      </Form>
    );
    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(render).not.toHaveBeenCalled();
  });

  it("should not render with component prop when given onSubmit", () => {
    const onSubmit = jest.fn();
    const render = jest.fn();
    renderIntoDocument(
      <Form onSubmit={onSubmitMock}>
        <Form.AutoSubmit onSubmit={onSubmit} component={render} />
      </Form>
    );
    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(render).not.toHaveBeenCalled();
  });
});

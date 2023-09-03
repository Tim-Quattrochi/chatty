import Input from "./Input";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("input functionality", () => {
  it("renders an input", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders an input with a placeholder", () => {
    render(<Input placeholder="test" />);
    expect(screen.getByPlaceholderText("test")).toBeInTheDocument();
  });

  it("renders an input with a value", () => {
    render(<Input value="test" />);
    expect(screen.getByDisplayValue("test")).toBeInTheDocument();
  });

  it("renders an input with a type", () => {
    render(<Input type="text" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders an input with a name", () => {
    render(<Input name="test" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders an input with a className", () => {
    render(<Input className="test" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});

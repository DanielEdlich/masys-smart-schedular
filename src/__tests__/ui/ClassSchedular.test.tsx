import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ClassScheduler from "@/components/ClassScheduler";

// Mock react-dnd
jest.mock("react-dnd", () => ({
  DndProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useDrag: () => [{ isDragging: false }, () => {}],
  useDrop: () => [{}, () => {}],
}));

jest.mock("react-dnd-html5-backend", () => ({
  HTML5Backend: jest.fn(),
}));

describe("ClassScheduler", () => {
  beforeEach(() => {
    render(<ClassScheduler />);
  });

  it("renders the table", () => {
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders weekday headers", () => {
    const weekdays = [
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
    ];
    weekdays.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it("renders class headers", () => {
    const classes = [
      "Class1",
      "Class2",
      "Class3",
      "Class4",
      "Class5",
      "Class6",
      "Class7",
      "Class8",
      "Class9",
      "Class10",
    ];
    classes.forEach((className) => {
      expect(screen.getByText(className)).toBeInTheDocument();
    });
  });

  it("renders week headers", () => {
    expect(screen.getAllByText("Woche A")).toHaveLength(10);
    expect(screen.getAllByText("Woche B")).toHaveLength(10);
  });
});

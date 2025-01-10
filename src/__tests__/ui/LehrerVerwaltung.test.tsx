import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Lehrerverwaltung from "@/app/lehrer-verwaltung/page";

jest.mock("@/components/Navbar", () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
}));

jest.mock("@/components/lehrer-verwaltung/CreateTeacherDialog", () => ({
  CreateTeacherDialog: () => <div>Create Teacher</div>,
}));

jest.mock("@/components/lehrer-verwaltung/TeacherAvatar", () => ({
  TeacherAvatar: () => <div>Avatar</div>,
}));

jest.mock("@/components/lehrer-verwaltung/EditTeacherDialog", () => ({
  EditTeacherDialog: () => <div>Edit Teacher</div>,
}));

jest.mock("@/components/lehrer-verwaltung/DeleteTeacherDialog", () => ({
  DeleteTeacherDialog: () => <div>Delete Teacher</div>,
}));

jest.mock("@/components/lehrer-verwaltung/TeacherBlocker", () => ({
  TeacherBlocker: () => <div>Teacher Blocker</div>,
}));

jest.mock("@/app/actions/teacherActions", () => ({
  getAllTeachers: () =>
    Promise.resolve([
      {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "123456",
        priority: "High",
        color: "#000000",
        blocker: [],
      },
    ]),
}));

describe("Lehrerverwaltung Page", () => {
  it("renders without crashing", async () => {
    render(await Lehrerverwaltung());
    expect(screen.getByText("Lehrerverwaltung")).toBeInTheDocument();
  });

  it("renders table headers", async () => {
    render(await Lehrerverwaltung());
    const headers = [
      "Avatar",
      "Name",
      "E-Mail",
      "Telefon",
      "Priorität",
      "Verfügbarkeit",
      "Aktionen",
    ];
    headers.forEach((header) => {
      expect(
        screen.getByRole("columnheader", { name: header }),
      ).toBeInTheDocument();
    });
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SchulklassenVerwaltung from "@/app/klassen-verwaltung/page";
import { getClasses, getTeachers } from "@/app/actions/classActions";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      refresh: jest.fn(),
    };
  },
}));

// Mock server actions
jest.mock("@/app/actions/classActions", () => ({
  getClasses: jest.fn(),
  getTeachers: jest.fn(),
  addClass: jest.fn(),
  editClass: jest.fn(),
}));

// Mock components
jest.mock("@/components/Navbar", () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
}));

const mockedGetClasses = getClasses as jest.MockedFunction<typeof getClasses>;
const mockedGetTeachers = getTeachers as jest.MockedFunction<
  typeof getTeachers
>;

describe("SchulklassenVerwaltung Page", () => {
  beforeEach(() => {
    // Setup mock data using the properly typed mock functions
    mockedGetClasses.mockResolvedValue([
      {
        id: 1,
        name: "Test Class 1",
        year: "1-3",
        track: "A",
        primary_teacher_id: 1,
        secondary_teacher_id: null,
      },
      {
        id: 2,
        name: "Test Class 2",
        year: "4-6",
        track: "B",
        primary_teacher_id: 2,
        secondary_teacher_id: null,
      },
    ]);
    mockedGetTeachers.mockResolvedValue([
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@test.com",
        phone: "1234567890",
        priority: 1,
        weekly_capacity: 40,
      },
      {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@test.com",
        phone: "0987654321",
        priority: 1,
        weekly_capacity: 40,
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(<SchulklassenVerwaltung />);
    expect(screen.getByText("Laden...")).toBeInTheDocument();
  });

  it("renders the page title", async () => {
    render(<SchulklassenVerwaltung />);
    expect(
      await screen.findByText("Schulklassen-Verwaltung"),
    ).toBeInTheDocument();
  });

  it('shows "Klasse hinzufügen" button and opens dialog on click', async () => {
    render(<SchulklassenVerwaltung />);
    const addButton = await screen.findByText("Klasse hinzufügen");
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    expect(
      await screen.findByText("Neue Klasse hinzufügen"),
    ).toBeInTheDocument();
  });

  it("renders the table headers correctly", async () => {
    render(<SchulklassenVerwaltung />);
    const headers = [
      "Name",
      "Jahrgang",
      "Zug",
      "Klassenlehrer",
      "Co-Klassenlehrer",
      "Aktionen",
    ];
    for (const header of headers) {
      expect(
        await screen.findByRole("columnheader", { name: header }),
      ).toBeInTheDocument();
    }
  });

  it("displays class data in the table", async () => {
    render(<SchulklassenVerwaltung />);
    expect(await screen.findByText("Test Class 1")).toBeInTheDocument();
    expect(await screen.findByText("Test Class 2")).toBeInTheDocument();
  });

  it("displays edit and delete buttons for each class", async () => {
    render(<SchulklassenVerwaltung />);
    expect(await screen.findAllByText("Bearbeiten")).toHaveLength(2);
    expect(await screen.findAllByText("Löschen")).toHaveLength(2);
  });
});

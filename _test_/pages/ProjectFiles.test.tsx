import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProjectFiles from "../../src/pages/ProjectFiles";
import { ErrorContextProvider } from "../../src/context/ErrorContext";
import Layout from "../../src/components/Layout";
import { UserAuthContextProvider } from "../../src/context/authenticationContext";

jest.mock("../../src/hooks/useProjects", () => {
  return () => ({
    getProjectByProjectId: jest.fn(() => ({
      projectId: "123",
      projectName: "Test Project",
      projectFiles: [],
    })),
    updateProject: jest.fn(),
  });
});

describe("projects files validation", () => {
  const setup = () => {
    render(
      <MemoryRouter initialEntries={["/projects/123/files"]}>
        <UserAuthContextProvider>
          <ErrorContextProvider>
            <Layout />
            <Routes>
              <Route
                path="/projects/:projectId/files"
                element={<ProjectFiles />}
              />
            </Routes>
          </ErrorContextProvider>
        </UserAuthContextProvider>
      </MemoryRouter>,
    );
  };

  test("renders project files page", () => {
    setup();
    expect(
      screen.getByText(/Welcome to the project files page!/i),
    ).toBeInTheDocument();
  });

  test("upload button disabled initially", () => {
    setup();
    expect(screen.getByRole("button", { name: /upload/i })).toBeDisabled();
  });

  test("enables upload button after file selection", () => {
    setup();
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });

    const fileInput = screen
      .getByLabelText(/press enter to add project files/i)
      .querySelector("input[type='file']") as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByRole("button", { name: /upload/i })).not.toBeDisabled();
    const previewSection = screen.getByRole("heading", {
      name: /Files Preview/i,
    }).parentElement!;
    expect(within(previewSection).getByText(/hello.txt/i)).toBeInTheDocument();
  });

  test("shows error message for oversized file", () => {
    setup();
    const bigFile = new File(["x".repeat(20000)], "big.txt", {
      type: "text/plain",
    });

    const fileInput = screen
      .getByLabelText(/press enter to add project files/i)
      .querySelector("input[type='file']") as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [bigFile] } });

    expect(screen.getByText(/File size too big/i)).toBeInTheDocument();
  });

  test("validates the file uploaded successfully message", async () => {
    setup();

    const file = new File(["hello"], "hello.txt", { type: "text/plain" });

    const fileInput = screen
      .getByLabelText(/press enter to add project files/i)
      .querySelector("input[type='file']") as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: /Upload/i }));

    expect(
      await screen.findByText(/Files uploaded successfully!/i),
    ).toBeInTheDocument();
  });
});

import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import ProjectFiles from "../../src/pages/ProjectFiles";
import { ErrorContextProvider } from "../../src/context/ErrorContext";
import { UserAuthContextProvider } from "../../src/context/authenticationContext";
import Layout from "../../src/components/Layout";

import {
  uploadFilesService,
  getProjectFilesService,
} from "../../src/services/projectAPI";

jest.mock("../../src/hooks/useProjects", () => {
  return () => ({
    getProjectByProjectId: jest.fn(() => ({
      project_id: "123",
      projectname: "Test Project",
      projectfiles: 0,
    })),
    updateProject: jest.fn(),
  });
});

jest.mock("../../src/hooks/useXHR", () => ({
  __esModule: true,
  default: () => ({
    callApi: jest.fn(),
  }),
}));

jest.mock("../../src/services/projectAPI", () => ({
  uploadFilesService: jest.fn(),
  getProjectFilesService: jest.fn(),
  deleteProjectFileService: jest.fn(),
}));

const mockGetProjectFilesService =
  getProjectFilesService as jest.MockedFunction<typeof getProjectFilesService>;

const mockUploadFilesService = uploadFilesService as jest.MockedFunction<
  typeof uploadFilesService
>;

describe("ProjectFiles", () => {
  const setup = async () => {
    mockGetProjectFilesService.mockResolvedValue({
      files: [],
    });

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

    await waitFor(() => expect(mockGetProjectFilesService).toHaveBeenCalled());
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders project files page", async () => {
    await setup();

    expect(
      screen.getByText(/Welcome to the project files page!/i),
    ).toBeInTheDocument();
  });

  test("upload button disabled initially", async () => {
    await setup();

    expect(screen.getByRole("button", { name: /upload/i })).toBeDisabled();
  });

  test("enables upload button after file selection", async () => {
    await setup();

    const file = new File(["hello"], "hello.txt", {
      type: "text/plain",
    });

    const fileInput = screen
      .getByLabelText(/press enter to add project files/i)
      .querySelector("input[type='file']") as HTMLInputElement;

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    expect(screen.getByRole("button", { name: /upload/i })).not.toBeDisabled();

    const previewSection = screen.getByRole("heading", {
      name: /Files Preview/i,
    }).parentElement!;

    expect(within(previewSection).getByText(/hello\.txt/i)).toBeInTheDocument();
  });

  test("shows error message for oversized file", async () => {
    await setup();

    const bigFile = new File([new Uint8Array(11 * 1024 * 1024)], "big.txt", {
      type: "text/plain",
    });

    const fileInput = screen
      .getByLabelText(/press enter to add project files/i)
      .querySelector("input[type='file']") as HTMLInputElement;

    fireEvent.change(fileInput, {
      target: {
        files: [bigFile],
      },
    });

    expect(screen.getByText(/File size too big/i)).toBeInTheDocument();
  });

  test("uploads file successfully", async () => {
    mockGetProjectFilesService.mockResolvedValue({
      files: [],
    });

    mockUploadFilesService.mockResolvedValue({
      success: true,
      message: "Files uploaded successfully!",
    });

    jest.mock("../../src/context/authenticationContext", () => ({
      UserAuthContextProvider: ({ children }: React.ReactNode) => children,
    }));

    await setup();

    const file = new File(["hello"], "hello.txt", {
      type: "text/plain",
    });

    const fileInput = screen
      .getByLabelText(/press enter to add project files/i)
      .querySelector("input[type='file']") as HTMLInputElement;

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /upload/i }));

    await waitFor(() => {
      expect(mockUploadFilesService).toHaveBeenCalled();
    });

    expect(mockGetProjectFilesService).toHaveBeenCalledTimes(2);
  });
});

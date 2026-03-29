import { render, screen, fireEvent } from "@testing-library/react";
import { UserAuthContextProvider } from "../../src/context/authenticationContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Login from "../../src/pages/Login";
import Projects from "../../src/pages/Projects";

// test for initial render of login page
describe("Login page render", () => {
  test("render login page", () => {
    render(
      <MemoryRouter>
        <UserAuthContextProvider>
          <Login />
        </UserAuthContextProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Project Management")).toBeInTheDocument();
  });
});

// login form validaiton tests
describe("Login form validation", () => {
  const setup = () => {
    render(
      <MemoryRouter>
        <UserAuthContextProvider>
          <Login />
        </UserAuthContextProvider>
      </MemoryRouter>,
    );
  };

  test("shows error for invalid email format", async () => {
    setup();

    // Clear email field and type invalid email
    fireEvent.change(screen.getByLabelText(/Email?/i), {
      target: { value: "invalid-email" },
    });

    fireEvent.change(screen.getByLabelText(/Password?/i), {
      target: { value: "changeme" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/please enter a valid email address./i),
    ).toBeInTheDocument();
  });

  test("shows error when email is empty", async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/Email?/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText(/Password?/i), {
      target: { value: "changeme" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/email is required./i)).toBeInTheDocument();
  });

  test("shows error when password is empty", async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/Email?/i), {
      target: { value: "john@mail.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password?/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/password is required./i),
    ).toBeInTheDocument();
  });
});

// Mock loginUserService
jest.mock("../../src/services/loginAPI", () => ({
  __esModule: true,
  default: jest.fn(() =>
    Promise.resolve({
      access_token: "fake-token",
      statusCode: 200,
      message: "OK",
    }),
  ),
}));

// Mock useAuth hook
jest.mock("../../src/hooks/useAuth", () => {
  let loggedIn = false;
  return () => ({
    loginUser: jest.fn(() => {
      loggedIn = true;
    }), // called with jwttoken
    get isLoggedIn() {
      return loggedIn;
    },
  });
});

describe("accepts valid login credentials and redirects to /projects", () => {
  test("navigates to /projects after login button click", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <UserAuthContextProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </UserAuthContextProvider>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@mail.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "changeme" },
    });

    // Click the login button
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByRole("heading", { name: /projects page/i }),
    ).toBeInTheDocument();
  });
});

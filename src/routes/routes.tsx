import { Suspense } from "react";
import { Navigate, createBrowserRouter, Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import Login from "../pages/Login";
import Projects from "../pages/Projects";
import ProjectDetails from "../pages/ProjectDetails";
import ProjectFiles from "../pages/ProjectFiles";
import MissingComponent from "../pages/MissingComponent";
import RenderError from "../pages/Error";
import Loader from "../components/Loader";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import { UserAuthContextProvider } from "../context/authenticationContext";
import { ProjectContextProvider } from "../context/ProjectContext";
import { ErrorContextProvider } from "../context/ErrorContext";
import ErrorBoundaryWrapper from "../components/ErrorBoundaryWrapper";

interface routesType {
  path: string;
  element: React.ReactNode;
  children?: routesType[];
}

// const Loader = () => <div>Loading...</div>;

const routes: routesType[] = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="/projects" replace />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "projects/:projectId",
        element: <ProjectDetails />,
      },
      {
        path: "projects/:projectId/files",
        element: <ProjectFiles />,
      },
    ],
  },
  {
    path: "/error",
    element: <RenderError />,
  },
  {
    path: "*",
    element: <MissingComponent />,
  },
];

const wrapWithSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<Loader />}>{element}</Suspense>
);

const mapRoutes = (routes: routesType[]): RouteObject[] => {
  return routes.map((route) => ({
    path: route.path,
    element: wrapWithSuspense(route.element),
    errorElement: wrapWithSuspense(<RenderError />),
    children: route.children ? mapRoutes(route.children) : undefined,
  }));
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundaryWrapper>
        <ErrorContextProvider>
          <UserAuthContextProvider>
            <ProjectContextProvider>
              <Suspense fallback={<Loader />}>
                <Outlet />
              </Suspense>
            </ProjectContextProvider>
          </UserAuthContextProvider>
        </ErrorContextProvider>
      </ErrorBoundaryWrapper>
    ),
    errorElement: (
      <Suspense fallback={<Loader />}>
        <RenderError />
      </Suspense>
    ),
    children: mapRoutes(routes),
  },
]);

export default router;

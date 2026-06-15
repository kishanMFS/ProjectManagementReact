import React, { createContext, useEffect, useReducer } from "react";

import useXHR from "../hooks/useXHR";
import { projectReducer, getProjects } from "../reducers/projectReducers";
import type { projectType } from "../types/projects";
import useAuth from "../hooks/useAuth";

type actionType =
  | { type: "SET_PROJECTS"; payload: projectType[] }
  | { type: "ADD_PROJECT"; payload: projectType }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "UPDATE_PROJECT"; payload: projectType };

type ProjectContextType = {
  projects: projectType[];
  dispatchProjectReducer: React.Dispatch<actionType>;
  loadProjects: "";
};

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, dispatchProjectReducer] = useReducer(projectReducer, []);
  const { callApi } = useXHR();

  const { isLoggedIn } = useAuth();

  const loadProjects = async () => {
    try {
      const response = await getProjects(callApi);

      if (response.success) {
        dispatchProjectReducer({
          type: "SET_PROJECTS",
          payload: response.data,
        });
      }
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadProjects();
    }
  }, [isLoggedIn]);

  return (
    <ProjectContext.Provider
      value={{ projects, dispatchProjectReducer, loadProjects }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export { ProjectContext };

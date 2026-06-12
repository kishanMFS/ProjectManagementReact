import React, { createContext, useEffect, useReducer, useRef } from "react";

import useXHR from "../hooks/useXHR";
import { projectReducer, getProjects } from "../reducers/projectReducers";
import type { projectType } from "../types/projects";

type actionType =
  | { type: "SET_PROJECTS"; payload: projectType[] }
  | { type: "ADD_PROJECT"; payload: projectType }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "UPDATE_PROJECT"; payload: projectType };

type ProjectContextType = {
  projects: projectType[];
  dispatchProjectReducer: React.Dispatch<actionType>;
};

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, dispatchProjectReducer] = useReducer(projectReducer, []);
  const { callApi } = useXHR();
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadProjects = async () => {
      try {
        const response = await getProjects(callApi);

        if (response.success) {
          dispatchProjectReducer({
            type: "SET_PROJECTS",
            payload: response.projects,
          });
        }
      } catch (error) {
        console.error("Failed to load projects", error);
      }
    };

    loadProjects();
  }, [callApi]);

  return (
    <ProjectContext.Provider value={{ projects, dispatchProjectReducer }}>
      {children}
    </ProjectContext.Provider>
  );
}

export { ProjectContext };

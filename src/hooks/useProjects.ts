import { useReducer, useEffect } from "react";
import { projectReducer, getProjects } from "../reducers/projectReducers";
import type { projectType } from "../types/projects";
import useXHR from "../hooks/useXHR";

function useProjects() {
  const [projects, dispatchProjectReducer] = useReducer(
    projectReducer,
    []
  );
  const { callApi } = useXHR();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects(callApi);

        dispatchProjectReducer({
          type: "SET_PROJECTS",
          payload: data,
        });
      } catch (error) {
        console.error("Failed to load projects", error);
      }
    };

    loadProjects();
  }, []);

  // actions

  const addProject = (project: projectType) => {
    dispatchProjectReducer({ type: "ADD_PROJECT", payload: project });
  };

  const updateProject = (projects: projectType) => {
    dispatchProjectReducer({ type: "UPDATE_PROJECT", payload: projects });
  };

  const deleteProject = (projectId: string) => {
    dispatchProjectReducer({ type: "DELETE_PROJECT", payload: projectId });
  };

  const getProjectByProjectId = (projectId: string) => {
    return projects.find((p) => p.id === projectId);
  };

  return {
    projects,
    getProjectByProjectId,
    addProject,
    updateProject,
    deleteProject,
  };
}

export default useProjects;

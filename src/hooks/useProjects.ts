import { useReducer, useEffect } from "react";
import { projectReducer, getProjects } from "../reducers/projectReducers";
import type { projectType } from "../types/projects";

function useProjects() {
  const [projects, dispatchProjectReducer] = useReducer(
    projectReducer,
    [],
    getProjects,
  );

  // useEffect(() => {
  //   localStorage.setItem("projects", JSON.stringify(projects));
  // }, [projects]);

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

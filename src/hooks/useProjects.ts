import type { projectType } from "../types/projects";
import { useProjectsContext } from "../hooks/useProject";

function useProjects() {
  const { projects, dispatchProjectReducer } = useProjectsContext();

  const addProject = (project: projectType) => {
    dispatchProjectReducer({ type: "ADD_PROJECT", payload: project });
  };

  const updateProject = (project: projectType) => {
    dispatchProjectReducer({ type: "UPDATE_PROJECT", payload: project });
  };

  const deleteProject = (projectId: string) => {
    dispatchProjectReducer({ type: "DELETE_PROJECT", payload: projectId });
  };

  const getProjectByProjectId = (projectId: string) => {
    return projects.find((p) => p.project_id === Number(projectId));
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectByProjectId,
  };
}

export default useProjects;

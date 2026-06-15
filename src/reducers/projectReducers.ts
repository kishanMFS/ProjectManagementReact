import type { projectType } from "../types/projects";
import { getProjectsService } from "../services/projectAPI";

type actionType =
  | { type: "SET_PROJECTS"; payload: getProjectsServiceType | [] }
  | { type: "ADD_PROJECT"; payload: projectType }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "UPDATE_PROJECT"; payload: projectType };

type getProjectsServiceType = {
  success: boolean;
  message: string;
  projects: [];
};
interface useXHRType<T> {
  apiURL: string;
  param?: object;
  onProgress?: (value: number) => number;
  resolve: (value: T) => void;
  reject: (value: unknown) => void;
  method?: string;
}
export const getProjects = async (
  callApi: (args: useXHRType<getProjectsServiceType>) => void,
) => {
  return await getProjectsService({
    callApi,
  });
};

export function projectReducer(
  currentState: projectType[],
  action: actionType,
) {
  switch (action.type) {
    case "SET_PROJECTS":
      return action.payload;
    case "ADD_PROJECT":
      return [...currentState, action.payload];
    case "DELETE_PROJECT":
      return currentState.filter(
        (project: projectType) => project.project_id !== action.payload,
      );
    case "UPDATE_PROJECT":
      return currentState.map((project: projectType) =>
        project.project_id === action.payload.project_id
          ? { ...project, ...action.payload }
          : project,
      );
    default:
      return currentState;
  }
}

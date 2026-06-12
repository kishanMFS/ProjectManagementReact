import type { projectType } from "../types/projects";
import {getProjectsService} from "../services/projectAPI";


type actionType =
| { type: "SET_PROJECTS"; payload: projectType[] }
| { type: "ADD_PROJECT"; payload: projectType }
| { type: "DELETE_PROJECT"; payload: string }
| { type: "UPDATE_PROJECT"; payload: projectType };

type getProjectsServiceType = {
  success: boolean,
  message: string,
  products: []
}
interface useXHRType<T> {
  apiURL: string;
  param?: object;
  onProgress?: (value: number) => number;
  resolve: (value: T) => void;
  reject: (value: unknown) => void;
  method?: string;
}
export const getProjects = async (callApi:(args:useXHRType<getProjectsServiceType>)=> void) => {  
  return await getProjectsService({
    callApi
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
        (project: projectType) => project.id !== action.payload,
      );
    case "UPDATE_PROJECT":
      return currentState.map((project: projectType) =>
        project.id === action.payload.id
          ? { ...project, ...action.payload }
          : project,
      );
    default:
      return currentState;
  }
}

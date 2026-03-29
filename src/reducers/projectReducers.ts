import type { projectType } from "../types/projects";

type actionType =
  | { type: "ADD_PROJECT"; payload: projectType }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "UPDATE_PROJECT"; payload: projectType };

export const getProjects = () => {
  return JSON.parse(localStorage.getItem("projects") || "[]");
};

export function projectReducer(
  currentState: projectType[],
  action: actionType,
) {
  switch (action.type) {
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

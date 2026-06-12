const apiURL: string = import.meta.env.VITE_API || "";
const ProjectAPI: string = apiURL + "/projects";

import type { projectType } from "../types/projects";

interface callApiType<T> {
  apiURL: string;
  param?: projectType;
  onProgress?: (value: number) => number;
  resolve: (value: T) => void;
  reject: (value: unknown) => void;
  method?: string;
}

type addProjectServiceType = {
  success: boolean;
  message: string;
  project: object;
};
interface addProjectType<T> {
  callApi: (args: callApiType<T>) => void;
  newProjectVlaues: projectType;
  onProgress: (value: number) => number;
}
export function addProjectService({
  callApi,
  newProjectVlaues,
  onProgress,
}: addProjectType<addProjectServiceType>): Promise<addProjectServiceType> {
  return new Promise<addProjectServiceType>((resolve, reject) => {
    callApi({
      apiURL: ProjectAPI,
      param: newProjectVlaues,
      onProgress,
      resolve,
      reject,
    });
  });
}

type getProjectsServiceType = {
  success: boolean;
  message: string;
  products: [];
};
interface getProjectsType<T> {
  callApi: (args: callApiType<T>) => void;
}

export function getProjectsService({
  callApi,
}: getProjectsType<getProjectsServiceType>): Promise<getProjectsServiceType> {
  return new Promise<getProjectsServiceType>((resolve, reject) => {
    callApi({
      apiURL: ProjectAPI,
      resolve,
      reject,
      method: "GET",
    });
  });
}

type deleteProjectServiceType = {
  isValid: boolean;
  message: string;
};
interface deleteProjectType {
  callApi: <T>(args: callApiType<T>) => void;
  projectID: number;
  onProgress: (value: number) => void;
  resolve: (value: deleteProjectServiceType) => void;
  reject: (value: unknown) => void;
}

export function deleteProjectService({
  callApi,
  projectID,
}: deleteProjectType): Promise<deleteProjectServiceType> {
  return new Promise<deleteProjectServiceType>((resolve, reject) => {
    callApi({
      apiURL: ProjectAPI + "/" + projectID,
      resolve,
      reject,
      method: "DELETE",
    });
  });
}

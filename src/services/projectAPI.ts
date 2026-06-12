const apiURL: string = import.meta.env.VITE_API || "";
const ProjectAPI: string = apiURL + "/projects";
const uploadFilesProjectAPI: string = apiURL + "/projects/{projectID}/files";
const getProjectFilesAPI: string = apiURL + "/projects/{projectID}/files";
const deleteFileProjectAPI: string = apiURL + "/projects/{projectID}/files/{fileID}";

import type { projectType } from "../types/projects";

interface callApiType <T> {
  apiURL: string;
  param?: projectType;
  onProgress?: (value: number) => number;
  resolve: (value: T) => void;
  reject: (value: unknown) => void;
  method?: string;
}


type addProjectServiceType = {
  success: boolean,
  message: string
};
interface addProjectType <T> {
  callApi: (args: callApiType<T>) => void;
  newProjectVlaues: projectType;
  onProgress: (value: number) => number;
}

export function addProjectService({
  callApi,
  newProjectVlaues,
  onProgress
  
}: addProjectType<addProjectServiceType>): Promise<addProjectServiceType> {
  return new Promise<addProjectServiceType>((resolve, reject) => {
    callApi({
      apiURL: ProjectAPI,
      param: newProjectVlaues,
      onProgress,
      resolve,
      reject
    });
  });
}


type getProjectsServiceType = {
  success: boolean,
  message: string,
  products: []
}
interface getProjectsType <T> {
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
      method:'GET'
    });
  });
}




type verifyUserServiceType = {
  isValid : boolean,
  message : string
}
interface verifyUserType {
  callApi: <T>(args: callApiType<T>) => void
  onProgress: (value: number) => void;
  resolve: (value: verifyUserServiceType) => void;
  reject: (value: unknown) => void;
}

export function verifyUserService({
  callApi,
  onProgress
}: verifyUserType): Promise<verifyUserServiceType> {
  return new Promise<verifyUserServiceType>((resolve, reject) => {
    callApi({
      apiURL: verifyAPI,
      onProgress,
      resolve,
      reject,
    });
  });
}


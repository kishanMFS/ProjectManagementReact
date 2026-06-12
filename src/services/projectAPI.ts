const apiURL: string = import.meta.env.VITE_API || "";
const ProjectAPI: string = apiURL + "/projects";
const uploadFilesProjectAPI: string = apiURL + "/projects/{projectID}/files";
const getProjectFilesAPI: string = apiURL + "/projects/{projectID}/files";
const deleteFileProjectAPI: string = apiURL + "/projects/{projectID}/files/{fileID}";

import type { projectType } from "../types/projects";

type addProjectServiceType = {
  success: boolean,
  message: string
};
interface callApiType<T> {
  apiURL: string;
  newProjectVlaues: projectType;
  resolve: (value: T) => void;
  reject: (value: unknown) => void;
}
interface addProjectType {
  callApi: <T>(args: callApiType<T>) => void;
  newProjectVlaues: projectType;
  onProgress: (value: number) => void;
}

export function addProjectService({
  callApi,
  newProjectVlaues,
  onProgress
  
}: addProjectType): Promise<addProjectServiceType> {
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


type logoutUserServiceType = {
  success: boolean,
  message: string
}

interface logoutUserType {
  callApi: <T>(args: callApiType<T>) => void;
  onProgress: (value: number) => void;
}

export function logoutUserService({
  callApi,
  onProgress
}: logoutUserType): Promise<logoutUserServiceType> {
  return new Promise<logoutUserServiceType>((resolve, reject) => {
    callApi({
      apiURL: logoutAPI,
      onProgress,
      resolve,
      reject,
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


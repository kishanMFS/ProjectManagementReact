const apiURL: string = import.meta.env.VITE_API || "";
const ProjectAPI: string = apiURL + "/projects";
const uploadFilesProjectAPI: string = apiURL + "/projects/{projectID}/files";
const getProjectFilesAPI: string = apiURL + "/projects/{projectID}/files";
const deleteFileProjectAPI: string =
  apiURL + "/projects/{projectID}/files/{fileID}";

import type { projectType, fileType } from "../types/projects";

interface callApiType<T> {
  apiURL: string;
  param?: projectType;
  onProgress?: (value: number) => number;
  resolve: (value: T) => void;
  reject: (value: unknown) => void;
  method?: string;
  contentType?: string;
}

type addProjectServiceType = {
  success: boolean;
  message: string;
  project: projectType;
};
interface addProjectType<T> {
  callApi: (args: callApiType<T>) => void;
  newProjectValues: projectType;
  onProgress: (value: number) => number;
}
export function addProjectService({
  callApi,
  newProjectValues,
  onProgress,
}: addProjectType<addProjectServiceType>): Promise<addProjectServiceType> {
  return new Promise<addProjectServiceType>((resolve, reject) => {
    callApi({
      apiURL: ProjectAPI,
      param: newProjectValues,
      onProgress,
      resolve,
      reject,
    });
  });
}

type getProjectsServiceType = {
  success: boolean;
  message: string;
  projects: [];
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
  success: boolean;
  message: string;
};
interface deleteProjectType {
  callApi: <T>(args: callApiType<T>) => void;
  projectID: string;
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

type uploadFilesServiceType = {
  success: boolean;
  message: string;
  files: fileType[];
};
interface uploadFilesType {
  callApi: <T>(args: callApiType<T>) => void;
  formdata: FormData;
  project_id: string;
  // onProgress: (value: number) => void;
  // resolve: (value: uploadFilesServiceType) => void;
  // reject: (value: unknown) => void;
}
export function uploadFilesService({
  callApi,
  project_id,
  formdata,
}: uploadFilesType): Promise<uploadFilesServiceType> {
  return new Promise<uploadFilesServiceType>((resolve, reject) => {
    callApi({
      apiURL: uploadFilesProjectAPI.replace("{projectID}", project_id),
      param: formdata,
      resolve,
      reject,
      contentType: "multipart/form-data",
    });
  });
}

export type projectFileType = {
  fileID: number;
  name: string;
  size: number;
  uploadedDate: string;
  files: fileType[];
};

export interface getProjectFilesType {
  callApi: <T>(args: callApiType<T>) => void;
  project_id: number;
}

export function getProjectFilesService({
  callApi,
  project_id,
}: getProjectFilesType): Promise<projectFileType> {
  return new Promise((resolve, reject) => {
    callApi({
      apiURL: getProjectFilesAPI.replace("{projectID}", String(project_id)),
      resolve,
      reject,
      method: "GET",
    });
  });
}

export type deleteProjectFileServiceType = {
  success: boolean;
  message: string;
};

export interface deleteProjectFileType {
  callApi: <T>(args: callApiType<T>) => void;
  projectID: number;
  fileID: number;
}

export function deleteProjectFileService({
  callApi,
  projectID,
  fileID,
}: deleteProjectFileType): Promise<deleteProjectFileServiceType> {
  return new Promise((resolve, reject) => {
    callApi({
      apiURL: deleteFileProjectAPI
        .replace("{projectID}", String(projectID))
        .replace("{fileID}", String(fileID)),
      method: "DELETE",
      resolve,
      reject,
    });
  });
}

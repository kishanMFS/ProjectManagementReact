const apiURL: string = import.meta.env.VITE_API || "";
const ProjectAPI: string = apiURL + "/projects";
const uploadFilesProjectAPI: string = apiURL + "/projects/{projectID}/files";
const getProjectFilesAPI: string = apiURL + "/projects/{projectID}/files";
const deleteFileProjectAPI: string =
  apiURL + "/projects/{projectID}/files/{fileID}";
const getJobsAPI: string = apiURL + "/projects/{projectID}/jobs";
// const getJobAPI: string = apiURL + '/{projectID}/jobs/{jobID}';
const createZipAPI: string = apiURL + "/projects/{projectID}/jobs/zip";
const downloadZipAPI: string =
  apiURL + "/projects/{projectID}/files/{zipName}/download";

import type { projectType, fileType } from "../types/projects";

interface callApiType<T> {
  apiURL: string;
  param?: projectType;
  onProgress?: (value: number) => number;
  resolve: (value: T) => void;
  reject: (value: unknown) => void;
  method?: string;
  contentType?: string;
  responseType?: XMLHttpRequestResponseType;
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
  success: string;
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

// get all jobs
export type getProjectJobsServiceType = {
  success: boolean;
  message: string;
  jobs: [];
};
export interface getProjectJobsType {
  callApi: <T>(args: callApiType<T>) => void;
  projectId: number;
}
export function getProjectJobsService({
  callApi,
  projectId,
}: getProjectJobsType): Promise<getProjectJobsServiceType> {
  return new Promise((resolve, reject) => {
    callApi({
      apiURL: getJobsAPI.replace("{projectID}", String(projectId)),
      resolve,
      reject,
      method: "GET",
    });
  });
}

// export type getProjectJobServiceType = {
//   success: boolean;
//   message: string;
// };
// export interface getProjectJobType {
//   callApi: <T>(args: callApiType<T>) => void;
//   projectID: number;
//   jobID: number;
// }

// export function getProjectJobService({
//   callApi,
//   projectID,
//   jobID
// }: getProjectJobType): Promise<getProjectJobServiceType> {
//   return new Promise((resolve, reject) => {
//     callApi({
//       apiURL: getJobAPI
//         .replace("{projectID}", String(projectID))
//         .replace("{jobID}", String(jobID)),
//       resolve,
//       reject,
//       method: "GET"
//     });
//   });
// }

export type createProjectJobServiceType = {
  success: boolean;
  message: string;
};
export interface createProjectJobType {
  callApi: <T>(args: callApiType<T>) => void;
  projectId: number;
  selectedFiles: [];
}
export function createProjectJobService({
  callApi,
  projectId,
  selectedFiles,
}: createProjectJobType): Promise<createProjectJobServiceType> {
  return new Promise((resolve, reject) => {
    callApi({
      apiURL: createZipAPI.replace("{projectID}", String(projectId)),
      param: { fileId: selectedFiles },
      resolve,
      reject,
    });
  });
}

export type downloadJobZipServiceType = {
  success: boolean;
  message: string;
  blob: Blob | MediaSource;
};
export interface downloadJobZipType {
  callApi: <T>(args: callApiType<T>) => void;
  projectId: string;
  zipname: string;
}
export function downloadJobZipService({
  callApi,
  projectId,
  zipname,
}: downloadJobZipType): Promise<downloadJobZipServiceType> {
  return new Promise((resolve, reject) => {
    callApi({
      apiURL: downloadZipAPI
        .replace("{projectID}", String(projectId))
        .replace("{zipName}", String(zipname)),
      resolve,
      reject,
      responseType: "blob",
      method: "GET",
    });
  });
}

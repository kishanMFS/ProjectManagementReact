export interface fileType {
  projectfileid: number;
  name: string;
  size: number;
  type: string;
  fileData: unknown;
  uploadeddate: string;
}

export interface jobType {
  id: string;
  jobName: string;
  status: "pending" | "running" | "completed" | "failed";
  createdDate: string;
  completedDate?: string;
}

export type projectType = {
  project_id?: string;
  projectname: string;
  description: string;
  createddate: string;
  projectfiles: number;
  projectjobs: number;
  fileId?: [];
};

export type projectJobType = {
  jobid: string;
  jobname?: string;
  status: "STARTED" | "PROCESSING" | "COMPLETED" | "FAILED";
  zipfile?: string;
  zipname?: string;
  progress?: number;
};

export interface fileType {
  name: string;
  size: number;
  type: string;
  fileData: unknown;
  uploadedDate: string;
}

export interface jobType {
  id: string;
  jobName: string;
  status: "pending" | "running" | "completed" | "failed";
  createdDate: string;
  completedDate?: string;
}

export type projectType = {
  project_id?: string | number;
  projectname: string;
  description: string;
  createddate: string;
  projectfiles: number;
  projectjobs: number;
};

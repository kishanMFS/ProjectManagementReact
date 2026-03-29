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
  id: string;
  projectName: string;
  description: string;
  createdDate: string;
  projectFiles: fileType[];
  projectJobs: jobType[];
};

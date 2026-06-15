import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useProjects from "../hooks/useProjects";

import ProjectDetailsModuleCSS from "../styles/ProjectDetails.module.css";
import GlobalModuleCSS from "../styles/Global.module.css";
// import {  } from "../types/projects.ts";
import type { fileType, projectJobType } from "../types/projects";
import useXHR from "../hooks/useXHR";
import {
  getProjectFilesService,
  getProjectJobsService,
  createProjectJobService,
  downloadJobZipService,
} from "../services/projectAPI";

function ProjectDetails() {
  const { projectId } = useParams<string>();
  const navigate = useNavigate();
  const { getProjectByProjectId } = useProjects();
  const pollingRef = useRef<number | null>(null);
  const { callApi } = useXHR();
  const [files, setFiles] = useState<fileType[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [jobs, setJobs] = useState<projectJobType[]>([]);

  const project = getProjectByProjectId(projectId || "");

  function handleSubmitFiles() {
    navigate(`/projects/${projectId}/files`); // Navigate to the upload page
  }

  async function loadFiles() {
    const response = await getProjectFilesService({
      callApi,
      project_id: Number(projectId),
    });

    if (response.success) {
      setFiles(response.files);
    }
  }

  async function loadJobs() {
    const response = await getProjectJobsService({
      callApi,
      projectId,
    });

    if (response.success) {
      setJobs(response.jobs);
    }
  }

  function handleFileSelection(fileId: string) {
    setSelectedFiles((current) =>
      current.includes(fileId)
        ? current.filter((id) => id !== fileId)
        : [...current, fileId],
    );
  }
  async function handleCreateJob() {
    const response = await createProjectJobService({
      callApi,
      projectId,
      selectedFiles,
    });

    if (response.success) {
      loadJobs();
      startPolling();
      setSelectedFiles([]);
    }
  }

  function startPolling() {
    if (pollingRef.current) return;

    pollingRef.current = window.setInterval(async () => {
      const response = await getProjectJobsService({
        callApi,
        projectId,
      });

      if (!response.success) return;
      setJobs(response.jobs);
      const processingJobs = response.jobs.some(
        (job) => job.status === "PENDING" || job.status === "PROCESSING",
      );

      if (!processingJobs && pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }, 700);
  }

  async function handleDownloadJob(zipname: string) {
    const blob = await downloadJobZipService({
      callApi,
      projectId,
      zipname,
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${zipname}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // loadFiles();
    // loadJobs();

    async function fetchData() {
      await Promise.all([loadFiles(), loadJobs()]);
    }

    fetchData();
  }, [projectId]);

  return (
    <div>
      <div className={ProjectDetailsModuleCSS.productDetailsPageHeader}>
        <h1>Project Details Page</h1>
        <p>Welcome to the project details page!</p>
      </div>
      {project && (
        <>
          <div className={ProjectDetailsModuleCSS.projectJobsArea}>
            <div className={ProjectDetailsModuleCSS.projectDetailsContainer}>
              <div className={ProjectDetailsModuleCSS.projectDetailsRow}>
                <span className={ProjectDetailsModuleCSS.projectDetailsLabel}>
                  Project Name
                </span>
                <span>
                  {project.projectname} - ({project.project_id})
                </span>
              </div>
              <div className={ProjectDetailsModuleCSS.projectDetailsRow}>
                <span className={ProjectDetailsModuleCSS.projectDetailsLabel}>
                  Project Info
                </span>
                <span>{project.description}</span>
              </div>
              <div className={ProjectDetailsModuleCSS.projectDetailsRow}>
                <span className={ProjectDetailsModuleCSS.projectDetailsLabel}>
                  Files
                </span>
                <span>{project.projectfiles || 0} files</span>
              </div>
              <div className={ProjectDetailsModuleCSS.projectDetailsRow}>
                <span className={ProjectDetailsModuleCSS.projectDetailsLabel}>
                  Jobs
                </span>
                <span>{project.projectjobs || 0} jobs</span>
              </div>
              <div className={ProjectDetailsModuleCSS.projectDetailsRow}>
                <span className={ProjectDetailsModuleCSS.projectDetailsLabel}>
                  Created Date
                </span>
                <span>{project.createddate}</span>
              </div>
              <div
                className={` ${ProjectDetailsModuleCSS.projectDetailsRow} ${ProjectDetailsModuleCSS.productDetailsBtn}`}
              >
                <input
                  type="button"
                  className={GlobalModuleCSS.btn}
                  value="Upload Files"
                  onClick={handleSubmitFiles}
                  aria-label={`upload project files for ${project.projectname} `}
                />
              </div>
            </div>

            <div className={ProjectDetailsModuleCSS.projectDetailsContainer}>
              {files.map((file, index) => (
                <div
                  key={file.projectfileid}
                  className={ProjectDetailsModuleCSS.filesList}
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(
                        String(file.projectfileid),
                      )}
                      onChange={() =>
                        handleFileSelection(String(file.projectfileid))
                      }
                    />
                  </div>
                  <div>
                    {index + 1}. {file.name}
                  </div>
                </div>
              ))}
              <input
                type="button"
                value="Create Job"
                className={GlobalModuleCSS.btn}
                onClick={handleCreateJob}
                disabled={selectedFiles.length === 0}
              />
            </div>
          </div>

          <div className={ProjectDetailsModuleCSS.jobsContainer}>
            <div className={ProjectDetailsModuleCSS.jobsHeader}>
              <div>job ID</div>
              <div>job name</div>
              <div>job status</div>
            </div>

            {jobs.map((job) => (
              <div
                key={job.jobid}
                className={ProjectDetailsModuleCSS.jobDetails}
              >
                <div className={ProjectDetailsModuleCSS.jobRow}>
                  {job.jobid}
                </div>

                <div className={ProjectDetailsModuleCSS.jobRow}>
                  {job.status === "Completed".toUpperCase() ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownloadJob(job.zipname);
                      }}
                    >
                      {job.zipname}
                    </a>
                  ) : (
                    job.zipname
                  )}
                </div>

                <div className={ProjectDetailsModuleCSS.jobRow}>
                  {job.status}{" "}
                  {job.progress < 100 &&
                    job.progress > 0 &&
                    ` (${job.progress}%)`}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectDetails;

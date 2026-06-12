import { useNavigate, useParams } from "react-router-dom";

import useProjects from "../hooks/useProjects";

import ProjectDetailsModuleCSS from "../styles/ProjectDetails.module.css";
import GlobalModuleCSS from "../styles/Global.module.css";

function ProjectDeatails() {
  const { projectId } = useParams<string>();
  const navigate = useNavigate();
  const { getProjectByProjectId } = useProjects();

  const project = getProjectByProjectId(projectId || "");

  function handleSubmitFiles() {
    navigate(`/projects/${projectId}/files`); // Navigate to the upload page
  }

  return (
    <div>
      <div className={ProjectDetailsModuleCSS.productDetailsPageHeader}>
        <h1>Project Details Page</h1>
        <p>Welcome to the project details page!</p>
      </div>
      {project && (
        <div>
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
        </div>
      )}
    </div>
  );
}

export default ProjectDeatails;

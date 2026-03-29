import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal/Modal";
import InputText from "../components/InputText";

import GlobalModuleCSS from "../styles/Global.module.css";
import ProjectsModuleCSS from "../styles/Projects.module.css";
import useProjects from "../hooks/useProjects";

import useErrorContext from "../hooks/useError";

import type { projectType } from "../types/projects";

function Projects() {
  const navigate = useNavigate();
  const [newProject, setNewProject] = useState({
    projectName: "New Project Name",
    description: "Project description",
    projectFiles: [],
    projectJobs: [],
    createdDate: new Date().toISOString().split("T")[0],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const { projects, addProject, deleteProject, getProjectByProjectId } =
    useProjects();
  const { showErrorMessage } = useErrorContext();

  function handleOpenProject(projectId: string) {
    navigate(`/projects/${projectId}`);
  }

  const handleInputChange = (field: string, value: string) => {
    setNewProject({
      ...newProject,
      [field]: value,
    });
  };

  const handleOpenCreateProject = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    if (modalOpen)
      document
        .querySelector<HTMLInputElement>("input[name='projectName']")
        ?.focus();
  }, [modalOpen]);

  function handleDeleteProject(projectId: string) {
    const deletedProject: projectType = getProjectByProjectId(projectId)!;
    deleteProject(projectId);
    showErrorMessage(`${deletedProject.projectName} Project Deleted`);
  }

  const handleCreateProject = () => {
    const newProjectVlaues: projectType = {
      ...newProject,
      id: Date.now().toString(), // since id is not defined in projectDetails, we can generate a unique id using timestamp
    };

    addProject(newProjectVlaues);
    showErrorMessage(`${newProject.projectName} Project added`);

    setModalOpen(false);
    setNewProject({
      projectName: "",
      description: "",
      projectFiles: [],
      projectJobs: [],
      createdDate: new Date().toISOString().split("T")[0],
    });
  };

  function handleOnClose() {
    setModalOpen(false);
  }

  return (
    <div>
      <Modal
        title="Create New Project"
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        footer={
          <>
            <button
              type="button"
              className={GlobalModuleCSS.btn}
              onClick={handleCreateProject}
              aria-label="create new project"
            >
              Create
            </button>
            <button
              type="button"
              className={GlobalModuleCSS.btn}
              onClick={handleOnClose}
              aria-label="close modal to create new project"
            >
              Close
            </button>
          </>
        }
      >
        <div>
          <div className={GlobalModuleCSS.inputGroup}>
            <label htmlFor="projectName">Project Name:</label>
            <InputText
              inputName="projectName"
              inputValue={newProject.projectName}
              onInputChange={handleInputChange}
              errorMessage=""
            />
          </div>
          <div className={GlobalModuleCSS.inputGroup}>
            <label htmlFor="description">Description:</label>
            <InputText
              inputName="description"
              inputValue={newProject.description}
              onInputChange={handleInputChange}
              errorMessage=""
            />
          </div>
        </div>
      </Modal>

      <div className={ProjectsModuleCSS.productPageHeader}>
        <h1>Projects Page</h1>
        <p>Welcome to the projects page!</p>
      </div>

      <div className={ProjectsModuleCSS.projectsContainer}>
        <div className={ProjectsModuleCSS.containerHeaderBtn}>
          <button
            className={GlobalModuleCSS.btn}
            onClick={handleOpenCreateProject}
            aria-label="create new project"
          >
            Create Project
          </button>
        </div>

        {projects.length ? (
          <table>
            <thead>
              <tr className={GlobalModuleCSS.textLeft}>
                <th>Project Name</th>
                <th>Description</th>
                <th>Files Count</th>
                <th>Jobs Count</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project: projectType, index: number) => (
                <tr className={GlobalModuleCSS.textLeft} key={index}>
                  <td className={ProjectsModuleCSS.tableCell}>
                    {project.projectName}
                  </td>
                  <td className={ProjectsModuleCSS.tableCell}>
                    {project.description}
                  </td>
                  <td className={ProjectsModuleCSS.tableCell}>
                    {project.projectFiles.length}
                  </td>
                  <td className={ProjectsModuleCSS.tableCell}>
                    {project.projectJobs.length}
                  </td>
                  <td className={ProjectsModuleCSS.tableCell}>
                    {project.createdDate}
                  </td>
                  <td>
                    <div className={ProjectsModuleCSS.actionsContainer}>
                      <button
                        type="button"
                        onClick={() => handleOpenProject(project.id)}
                        className={GlobalModuleCSS.btn}
                        aria-label={`open project ${project.projectName} `}
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(project.id)}
                        className={GlobalModuleCSS.btn}
                        aria-label={`delete project ${project.projectName} `}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          "No Projects Available"
        )}
      </div>
    </div>
  );
}

export default Projects;

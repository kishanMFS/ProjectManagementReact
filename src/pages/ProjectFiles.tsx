import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import useProjects from "../hooks/useProjects";
import useErrorContext from "../hooks/useError";
import type { projectType, fileType } from "../types/projects";

import ProjectFilesModuleCSS from "../styles/ProjectFiles.module.css";
import GlobalModuleCSS from "../styles/Global.module.css";

function ProjectFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const FILE_MAX_SIZE = 1024 * 10; // 10kb
  const { showErrorMessage } = useErrorContext();

  const { getProjectByProjectId, updateProject } = useProjects();

  const { projectId } = useParams<string>();
  const [hasFiles, setHasFiles] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const foundProject = getProjectByProjectId(projectId || "");

  const [currentProjectFiles, setCurrentProjectFiles] = useState<fileType[]>(
    foundProject?.projectFiles || [],
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setFiles(Array.from(e.target.files));
    setHasFiles(true);
    setBtnDisabled(false);
  }

  const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  async function handleFileUpload() {
    const newFiles = await Promise.all(
      files
        .filter((file) => file.size <= FILE_MAX_SIZE)
        .map(async (file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          fileData: await convertToBase64(file),
          uploadedDate: new Date().toISOString().split("T")[0],
        })),
    );
    if (!foundProject) return;
    const existingFiles: fileType[] = foundProject.projectFiles || [];
    const updatedProject: projectType = {
      ...foundProject,
      projectFiles: [...existingFiles, ...newFiles],
    };
    setCurrentProjectFiles([...existingFiles, ...newFiles]);
    updateProject(updatedProject);

    showErrorMessage("Files uploaded successfully!");
    setTimeout(() => {
      showErrorMessage("");
    }, 3000);
    setFiles([]);
    setHasFiles(false);
    setBtnDisabled(true);
  }

  function handleFileDelete(index: number) {
    const updatedFiles = currentProjectFiles.filter(
      (_, i: number) => i !== index,
    );
    setCurrentProjectFiles(updatedFiles);
    if (!foundProject) return;
    const updatedProject: projectType = {
      ...foundProject,
      projectFiles: updatedFiles,
    };
    updateProject(updatedProject);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    setHasFiles(true);
    setBtnDisabled(false);
    setFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (!foundProject) {
      showErrorMessage("No project found. Please create a project first.");
    }
  }, [foundProject, showErrorMessage]);

  return (
    <div>
      {foundProject ? (
        <div className={ProjectFilesModuleCSS.projectFilesPage}>
          <h1>Project Files Page</h1>
          <p>Welcome to the project files page!</p>

          <div className={ProjectFilesModuleCSS.uploadArea}>
            <div
              className={ProjectFilesModuleCSS.fileUploadSection}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              tabIndex={0}
              aria-label={`press enter to add project files for ${foundProject.projectname} `}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("ProjectFile")?.click();
                }
              }}
            >
              <label
                htmlFor="ProjectFile"
                className={ProjectFilesModuleCSS.fileUploadBtn}
              >
                <div className={ProjectFilesModuleCSS.dragSection}>
                  {files.map((file: File, index: number) => (
                    <div
                      className={ProjectFilesModuleCSS.dragFilesField}
                      key={index}
                    >
                      {file.name}
                    </div>
                  ))}
                  <div className={ProjectFilesModuleCSS.dragArea}>
                    {hasFiles ? "" : <p>Drag and drop files here</p>}
                  </div>
                  <input
                    type="file"
                    id="ProjectFile"
                    name="ProjectFile"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              </label>
            </div>
            <div className={ProjectFilesModuleCSS.projectFileUpload}>
              <button
                className={GlobalModuleCSS.btn}
                type="button"
                disabled={btnDisabled}
                onClick={handleFileUpload}
                aria-label={`press enter to upload project files for ${foundProject.projectname} `}
              >
                Upload
              </button>
            </div>
          </div>
          <div className={ProjectFilesModuleCSS.filesContainer}>
            <div
              className={` ${ProjectFilesModuleCSS.previewSection} ${ProjectFilesModuleCSS.filesSection} `}
            >
              <h2>Files Preview</h2>
              {files.map((file: File, index: number) => (
                <div className={ProjectFilesModuleCSS.filesField} key={index}>
                  <div>{file.name}</div>
                  <div className={ProjectFilesModuleCSS.fileSize}>
                    size : {file.size / 1000} Kb
                  </div>
                  <div className={ProjectFilesModuleCSS.fileError}>
                    {file.size > FILE_MAX_SIZE ? "File size too big" : ""}
                  </div>
                </div>
              ))}
            </div>
            <div className={`  ${ProjectFilesModuleCSS.filesSection} `}>
              <h2>Uploaded Files</h2>
              <div className={ProjectFilesModuleCSS.filesContent}>
                {currentProjectFiles.map((file: fileType, index: number) => (
                  <div className={ProjectFilesModuleCSS.filesField} key={index}>
                    <div className={ProjectFilesModuleCSS.fileDeleteBtn}>
                      <span
                        className={ProjectFilesModuleCSS.fileDelete}
                        onClick={() => handleFileDelete(index)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleFileDelete(index);
                          }
                        }}
                        aria-label={`remove project file ${file.name} for ${foundProject.projectname} `}
                      >
                        x
                      </span>
                    </div>
                    <div>{file.name}</div>
                    <div className={ProjectFilesModuleCSS.fileSize}>
                      size : {file.size / 1000} Kb | Uploaded Date:{" "}
                      {file.uploadedDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ProjectFiles;

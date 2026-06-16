import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import useProjects from "../hooks/useProjects";
import useErrorContext from "../hooks/useError";
import type { fileType } from "../types/projects";
import {
  uploadFilesService,
  getProjectFilesService,
  deleteProjectFileService,
} from "../services/projectAPI";
import useXHR from "../hooks/useXHR";
import ProjectFilesModuleCSS from "../styles/ProjectFiles.module.css";
import GlobalModuleCSS from "../styles/Global.module.css";

function ProjectFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const FILE_MAX_SIZE = 1024 * 1024 * 10; // 1 MB
  const { showErrorMessage } = useErrorContext();
  const { callApi } = useXHR();
  const { getProjectByProjectId } = useProjects();

  const { projectId } = useParams<string>();
  const [hasFiles, setHasFiles] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const foundProject = getProjectByProjectId(projectId || "");
  const [currentProjectFiles, setCurrentProjectFiles] = useState<fileType[]>(
    [],
  );

  const loadFiles = useCallback(async () => {
    try {
      const response = await getProjectFilesService({
        callApi,
        project_id: Number(projectId),
      });

      setCurrentProjectFiles(response.data);
    } catch {
      showErrorMessage("Failed to load files");
    }
  }, [callApi, projectId, showErrorMessage]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setFiles(Array.from(e.target.files));
    setHasFiles(true);
    setBtnDisabled(false);
  }

  async function handleFileUpload() {
    const formdata = new FormData();
    files
      .filter((file) => file.size <= FILE_MAX_SIZE)
      .forEach((file) => {
        formdata.append("files", file);
      });

    const response = await uploadFilesService({
      callApi,
      project_id: projectId,
      formdata,
    });

    if (response.success) {
      await loadFiles();
      showErrorMessage(response.message);
      setFiles([]);
      setHasFiles(false);
      setBtnDisabled(true);
    }
    setTimeout(() => {
      showErrorMessage("");
    }, 3000);
  }

  async function handleFileDelete(fileID: number) {
    try {
      const response = await deleteProjectFileService({
        callApi,
        projectID: Number(projectId),
        fileID,
      });

      if (response.success) {
        await loadFiles();
      }
    } catch {
      showErrorMessage("Unable to delete file");
    }
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
    if (!projectId) {
      showErrorMessage("No project found. Please create a project first.");
      return;
    }

    // loadFiles();
    void (async () => {
      try {
        const response = await getProjectFilesService({
          callApi,
          project_id: Number(projectId),
        });

        setCurrentProjectFiles(response.data);
      } catch {
        showErrorMessage("Failed to load files");
      }
    })();
  }, [projectId]);

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
                    size : {(file.size / 1024).toFixed(2)} Kb
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
                        onClick={() => handleFileDelete(file.projectfileid)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleFileDelete(file.projectfileid);
                          }
                        }}
                        aria-label={`remove project file ${file.name} for ${foundProject.projectname} `}
                      >
                        x
                      </span>
                    </div>
                    <div>{file.name}</div>
                    <div className={ProjectFilesModuleCSS.fileSize}>
                      size : {(file.size / 1024).toFixed(2)} Kb | Uploaded Date:{" "}
                      {file.uploadeddate}
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

import React from "react";
import { useDropzone } from "react-dropzone";

const FileDropzone = ({
  label = "Upload Files",
  onFilesSelected = () => {},
  height = "280px",
  width = "100%",
}) => {
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (files) => onFilesSelected(files),
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center text-center p-5 cursor-pointer"
        style={{ height, width }}
      >
        <input {...getInputProps()} />

        <p className="text-gray-600 text-sm">
          Drag & Drop your files here
        </p>

        <button
          type="button"
          onClick={open}
          className="mt-3 px-4 py-2 text-sm bg-teal-600 text-white rounded-md shadow hover:bg-teal-700"
        >
          Browse Files
        </button>
      </div>

      {acceptedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold">Files:</h4>
          <ul className="list-disc ml-6">
            {acceptedFiles.map((file) => (
              <li key={file.path}>
                {file.path} — {file.size} bytes
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;

import { Button } from "@heroui/react";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const FileDropzone = ({
  label = "Upload your Course Thumbnail",
  text = ' Recommended: 1280x720 pixels',
  files,
  setFiles,
  height = "280px",
  className = "w-full",
  uploadBgColor = "#95c4be44",
  isMultiple = false,
  showFilesThere = true,
  width = "100%",
}) => {
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noKeyboard: true,
    multiple: isMultiple,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
  });
  const removeFile = (index) => {
    if (index >= 0) {

      const newFiles = files.filter((_, i) => i !== index);

      setFiles(newFiles);
    } else {
      setFiles([])
    }
  };
  const getUploadedImageSrc = (file) => {
    if (!file) {
      console.error("No file provided.");
      return null;
    }
    if (typeof file === "string") return file;
    const imageUrl = URL.createObjectURL(file);
    return imageUrl;
  };
  return (
    <div className={className}>


      {showFilesThere && files.length > 0 ? (
        <div
          className="border-2 relative border-[#06574C] border-dashed rounded-lg text-center cursor-pointer overflow-hidden"
          style={{ height, width }}
        >
          <PlusCircle
            onClick={() => removeFile()}
            color="white"
            className="rotate-45 top-0 right-0   absolute cursor-pointer z-40"
            fill="red"
          />

          {files.length === 1 ? (
            <img
              src={getUploadedImageSrc(files[0])}
              alt="uploded file"
              title="uploded file"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 w-full h-full overflow-auto">
              {files.map((file, i) => (
                <div key={i} className="relative group">
                  <img
                    src={getUploadedImageSrc(file)}
                    alt={`uploded file ${i}`}
                    title={`uploded file ${i}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <PlusCircle
                    onClick={() => removeFile(i)}
                    color="white"
                    fill="red"
                    className="rotate-45 -top-3 -right-3 absolute cursor-pointer z-10"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) :
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-[#06574C] rounded-lg flex flex-col items-center justify-center text-center p-5 cursor-pointer"
          style={{ height, width, backgroundColor: uploadBgColor }}
        >
          <input name="files" {...getInputProps()} multiple={isMultiple} />

          <img src={'/icons/upload.png'} alt="upload icon" className=" w-14" />
          <h1 className="text-gray-800 text-[16px] font-semibold">
            {label}
          </h1>
          <p className="text-gray-600 text-xs">
            {text}
          </p>

          {/* Select Files button removed as per user request */}

        </div>
      }
      {showFilesThere && files.length > 0 && (
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

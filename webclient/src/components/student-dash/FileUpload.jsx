import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import useAuth from "../../hooks/useAuth";

const FileUpload = ({ data }) => {
  const { decoded } = useAuth();
  const [responseMessage, setResponseMessage] = useState(null);

  const maxFileSize = 1024 * 1024; // 1MB
  const onDrop = async (acceptedFiles, rejectedFiles) => {
    setResponseMessage(null);

    if (rejectedFiles.length > 0) {
      if (rejectedFiles[0].size > maxFileSize) {
        // display the error with the selected file's size with one decimal place (e.g., 1.2MB)
        setResponseMessage(`Error uploading a ${(rejectedFiles[0].file.size / 1024 / 1024).toFixed(1)}MB file: File must be less than 1MB`);
        return;
      }
      setResponseMessage(`Error uploading a .${rejectedFiles[0].file.name.split(".").pop()} file: File must be a .js or .py file`);
      return;
    }

    const selectedFile = acceptedFiles[0];

    // Create a FormData object to send the file and the question to the server
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("email", decoded.email);
    formData.append("language", selectedFile.name.endsWith(".js") ? "javascript" : "python");
    formData.append("question", JSON.stringify(data.challenge));

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/submit-code`, formData);
      setResponseMessage(`File uploaded successfully: ${response.data.message}`);
    } catch (error) {
      setResponseMessage("Error uploading file");
      console.error(error);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, isFocused } = useDropzone({ onDrop, maxFiles: 1, maxSize: maxFileSize, accept: { "text/javascript": [".js"], "text/x-python": [".py"] } });

  const getColor = (isDragAccept, isDragReject, isFocused) => {
    if (isDragAccept) return "bg-green-300 border-green-500";
    if (isDragReject) return "bg-red-300 border-red-500";
    if (isFocused) return "bg-blue-300 border-blue-500";
    return "bg-gray-100 border-gray-300";
  };

  return (
    <div className="bg-gray-100 rounded-md p-4 border border-gray-300 mt-4 w-[400px] mx-auto">
      <h3 className="text-lg font-semibold mb-2">Upload your file</h3>
      <div {...getRootProps()} className={`mb-2 border-2 hover:border-2 hover:border-dashed hover:border-blue-300 rounded-md ${getColor(isDragAccept, isDragReject, isFocused)} text-gray-600 ${isDragActive ? "bg-blue-200" : ""}`}>
        <input {...getInputProps()} />
        <p>Drag &#39;n&#39; drop a .js or .py file here, or click to select one.</p>
      </div>
      {responseMessage && <div className="mt-4 text-sm text-gray-600">{responseMessage}</div>}
    </div>
  );
};

FileUpload.propTypes = {
  data: PropTypes.object.isRequired,
};

export default FileUpload;

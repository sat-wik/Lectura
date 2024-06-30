import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import axios from 'axios';
import '../styles/FileUpload.css';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fileContent, setFileContent] = useState('');
  const [response, setResponse] = useState('');

  const onDrop = acceptedFiles => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: URL.createObjectURL(file),
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDelete = (fileToDelete) => {
    URL.revokeObjectURL(fileToDelete.preview);
    setFiles(files.filter(file => file.id !== fileToDelete.id));
    if (selectedFile?.id === fileToDelete.id) {
      setSelectedFile(null);
      setFileContent('');
    }
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setPageNumber(1);

    if (file.type === 'text/plain') {
      fetch(file.preview)
        .then(response => response.text())
        .then(text => setFileContent(text));
    } else {
      setFileContent('');
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFileContent('');
  };

  const goToPrevPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, selectedFile.numPages));
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'application/pdf':
        return 'PDF';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'DOCX';
      case 'text/plain':
        return 'TXT';
      case 'image/jpeg':
        return 'JPG';
      case 'image/png':
        return 'PNG';
      default:
        return 'FILE';
    }
  };

  const truncateFileName = (fileName) => {
    const maxLength = 20; // adjust the max length as needed
    if (fileName.length > maxLength) {
      return `${fileName.substring(0, maxLength - 3)}...`;
    }
    return fileName;
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file.file); // Append the actual File object
    });

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Files uploaded successfully:', response.data);
      setResponse(response.data.data); // Set the response data to the state
    } catch (error) {
      console.error('Error uploading files:', error);
      setResponse(`Error uploading files: ${error.message}`); // Set the error message to the state
    }
  };

  return (
    <div className="container">
      <div className="upload-section">
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <div className="upload-icon">&#x2191;</div>
            <p>Drag and Drop file<br />or</p>
            <button className="browse-button">Browse</button>
          </div>
        </div>
        <div className="file-list">
          {files.map(file => (
            <div key={file.id} className="file-item">
              <div onClick={() => handleFileClick(file)} className="file-info">
                <span className="file-icon"><span>{getFileIcon(file.type)}</span></span>
                <div className="file-details">
                  <span className="file-name">{truncateFileName(file.name)}</span>
                  <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
              <IconButton onClick={() => handleDelete(file)} className="delete-button">
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleUpload} className="upload-button">Upload Files</button>
      <Modal
        open={Boolean(selectedFile)}
        onClose={handleClose}
        aria-labelledby="preview-title"
        aria-describedby="preview-description"
      >
        <Box className="modal-box">
          {selectedFile && selectedFile.type === 'application/pdf' && (
            <>
              <div className="pdf-navigation">
                <IconButton onClick={goToPrevPage} disabled={pageNumber <= 1} className="pdf-navigation-button left">
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton onClick={goToNextPage} disabled={pageNumber >= selectedFile.numPages} className="pdf-navigation-button right">
                  <ArrowForwardIosIcon />
                </IconButton>
              </div>
              <Document
                file={selectedFile.preview}
                onLoadSuccess={({ numPages }) => setSelectedFile(prev => ({ ...prev, numPages }))}
                onLoadError={console.error}
                className="pdf-viewer"
              >
                <Page pageNumber={pageNumber} />
              </Document>
            </>
          )}
          {selectedFile && selectedFile.type.startsWith('image/') && (
            <img src={selectedFile.preview} alt={selectedFile.name} className="image-preview" />
          )}
          {selectedFile && selectedFile.type === 'text/plain' && (
            <div className="text-preview">
              <pre>{fileContent}</pre>
            </div>
          )}
          {selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
            <div className="docx-preview">
              <p>Preview not available for .docx files.</p>
            </div>
          )}
        </Box>
      </Modal>
      {response && (
        <div className="response-box">
          <h3>Generated Quiz Questions:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

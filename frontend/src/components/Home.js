import React from 'react';
import FileUpload from './FileUpload';

const Home = () => {
  const handleFiles = (files) => {
    console.log('Handle the files:', files);
  };

  return (
    <div>
      <FileUpload onFileAccepted={handleFiles} />
    </div>
  );
};

export default Home;

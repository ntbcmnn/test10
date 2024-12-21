import React, { useEffect, useRef, useState } from 'react';

interface Props {
  name: string;
  label: string;
  onGetFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
}

const FileInput: React.FC<Props> = ({name, label, onGetFile, file}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const activateInput: () => void = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else setFileName('');

    onGetFile(e);
  };

  useEffect(() => {
    if (!file) setFileName('');
  }, [file]);

  return (
    <>
      <input
        style={{display: 'none'}}
        type="file"
        name={name}
        ref={inputRef}
        onChange={onFileChange}
      />

      <div className="d-flex justify-content-start gap-4 align-items-center mb-3">
        <input
          className="form-control"
          disabled
          placeholder={label}
          value={fileName}
          onClick={activateInput}
        />
        <button type="button" className="btn btn-dark fs-5" onClick={activateInput}>
          <i className="bi bi-file-earmark-arrow-up"></i>
        </button>
      </div>
    </>
  );
};

export default FileInput;
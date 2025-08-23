import React from 'react';
import './ResumeFolder.css';
interface ResumeFolderProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ResumeFolder: React.FC<ResumeFolderProps> = ({ isOpen = true }) => {
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);

  const resumeLink = {
    name: 'resume',
    url: 'https://drive.google.com/drive/folders/1oWWCXUaJmtXeAAKhIJsq-pS5p9P5G18t?usp=sharing',
  };

  const handleFileClick = () => {
    setSelectedFile(selectedFile === resumeLink.name ? null : resumeLink.name);
  };

  const handleFileDoubleClick = () => {
    window.open(resumeLink.url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="resume-folder-content">
      <ul className="file-list">
        <li
          className={`file-item ${selectedFile === resumeLink.name ? 'selected' : ''}`}
          onClick={handleFileClick}
          onDoubleClick={handleFileDoubleClick}
        >
          <span className="file-icon">📄</span>
          <span className="file-name">{resumeLink.name}</span>
        </li>
      </ul>
    </div>
  );
};

export default ResumeFolder;

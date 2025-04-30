import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';

type MarkdownFile = {
  filename: string;
  content: string;
};

export default function MarkdownList() {
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const { request, error, loading } = useFetch();

  useEffect(() => {
    request({
      endpoint: 'http://localhost:3001/markdown-files-with-content',
      onSuccess: (data) => setFiles(data),
    });
  }, []);

  return (
    <div>
      <h2>Saved Markdown Files</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {files.length === 0 && !loading && <p>No markdown files found.</p>}
      <ul>
        {files.map((file) => (
          <li key={file.filename}>
            <h3>{file.filename}</h3>
            <pre style={{ background: '#f4f4f4', padding: '0.5rem' }}>
              {file.content}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}

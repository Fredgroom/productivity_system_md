import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';

export default function MarkdownForm() {
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const { request, status } = useFetch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const endFileName = `${Date.now()}-${filename}`;
    request({
      endpoint: 'http://localhost:3001/save-markdown',
      method: 'POST',
      body: { filename: endFileName, content },
    });
  };

  useEffect(() => {
    if (status == 'Success') {
      setFilename('');
      setContent('');
    }
  }, [status]);

  return (
    <div className='block'>
      <h1>Save Markdown File</h1>
      <form onSubmit={handleSubmit} className='flex flex-col items-start'>
        <label className='flex flex-col'>
          Filename:{' '}
          <input
            type='text'
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            required
          />
        </label>
        <label className='flex flex-col'>
          Markdown Content:{' '}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            required
          />
        </label>
        <button type='submit'>Save File</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

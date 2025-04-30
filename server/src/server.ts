import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { withErrorHandling } from './utils/withErrorHandling';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const saveDir = path.resolve('saved');
if (!fs.existsSync(saveDir)) {
  fs.mkdirSync(saveDir, { recursive: true });
}

app.get(
  '/markdown-files',
  withErrorHandling(async (_req: Request, res: Response) => {
    const files = await fs.promises.readdir(saveDir);
    const markdownFiles = files.filter((file) => file.endsWith('.md'));
    res.json(markdownFiles);
  })
);

app.get(
  '/markdown-files-with-content',
  withErrorHandling(async (_req: Request, res: Response) => {
    const files = await fs.promises.readdir(saveDir);
    const markdownFiles = files.filter((file) => file.endsWith('.md'));

    const results = await Promise.all(
      markdownFiles.map(async (file) => {
        const content = await fs.promises.readFile(
          path.join(saveDir, file),
          'utf-8'
        );
        return { filename: file, content };
      })
    );

    res.json(results);
  })
);

app.post(
  '/save-markdown',
  withErrorHandling(async (req: Request, res: Response) => {
    console.log('📩 Received request at /save-markdown');
    console.log('📝 Body:', req.body);
    const { filename, content } = req.body;
    const frontmatter = `---
created:${Date.now()}
---
`;

    if (!filename) {
      res.status(400).json({
        error: {
          message: 'Missing filename.',
        },
      });
      return;
    }

    const safeFilename = filename.replace(/[^a-z0-9_]/gi, '_');
    const filePath = path.join(saveDir, `${safeFilename}.md`);
    const newContent = content ? frontmatter + content : '';
    await fs.promises.writeFile(filePath, newContent ?? '');
    console.log('✅ Response: File Saved');
    res.send('File saved.');
  })
);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

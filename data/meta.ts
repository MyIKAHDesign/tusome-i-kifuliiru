import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const metaPath = path.join(process.cwd(), 'pages', '_meta.json');
    const fileContents = fs.readFileSync(metaPath, 'utf8');
    const meta = JSON.parse(fileContents);
    res.status(200).json(meta);
  } catch (error) {
    console.error('Error reading meta.json:', error);
    res.status(500).json({ error: 'Failed to load meta data' });
  }
}


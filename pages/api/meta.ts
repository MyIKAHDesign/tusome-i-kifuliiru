import { NextApiRequest, NextApiResponse } from 'next';
import { getMetaData } from '../../lib/content-loader';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const meta = getMetaData();
    res.status(200).json(meta);
  } catch (error) {
    console.error('Error reading meta.json:', error);
    res.status(500).json({ error: 'Failed to load meta data' });
  }
}


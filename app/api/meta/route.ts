import { NextResponse } from 'next/server';
import { getMetaData } from '../../../lib/content-loader';

export async function GET() {
  try {
    const meta = getMetaData();
    return NextResponse.json(meta);
  } catch (error) {
    console.error('Error reading meta.json:', error);
    return NextResponse.json(
      { error: 'Failed to load meta data' },
      { status: 500 }
    );
  }
}


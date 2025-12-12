import { NextRequest, NextResponse } from 'next/server';
import { getContentData } from '../../../lib/json-content-loader';
import { getContentBySlug } from '../../../lib/content-loader';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    // Try JSON content first
    const jsonContent = getContentData(slug);
    if (jsonContent) {
      return NextResponse.json({
        contentType: 'json',
        content: jsonContent,
      });
    }

    // Try MDX content - return raw content and frontmatter
    const mdxContent = getContentBySlug(slug);
    if (mdxContent) {
      return NextResponse.json({
        contentType: 'mdx',
        content: {
          rawContent: mdxContent.content,
          frontmatter: mdxContent.data,
        },
      });
    }

    return NextResponse.json(
      { error: 'Content not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}


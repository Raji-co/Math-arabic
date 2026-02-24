import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET /api/articles - get all articles
export async function GET() {
    const articles = await prisma.node.findMany({
        where: { type: 'article' },
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(articles);
}

// POST /api/articles - create a new article
export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (!data.title || !data.content || !data.parentId) {
            return NextResponse.json(
                { error: 'Missing required fields (title, content, parentId)' },
                { status: 400 }
            );
        }

        // Create the new article Node and link to its parent topic in one transaction
        const newArticle = await prisma.node.create({
            data: {
                type: 'article',
                title: data.title,
                content: typeof data.content === 'string' ? data.content : JSON.stringify(data.content),
                status: data.status || 'draft',
                asChild: {
                    create: { parentId: data.parentId }
                }
            },
        });

        return NextResponse.json({ success: true, article: newArticle }, { status: 201 });

    } catch (error) {
        console.error('Failed to save article:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

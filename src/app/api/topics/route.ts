import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET /api/topics - get all topics (for populating dropdowns)
export async function GET() {
    const topics = await prisma.node.findMany({
        where: { type: 'topic' },
        orderBy: { title: 'asc' },
        select: { id: true, title: true, description: true, createdAt: true }
    });
    return NextResponse.json(topics);
}

// POST /api/topics - create a new topic/subject
export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (!data.title) {
            return NextResponse.json(
                { error: 'Missing required field: title' },
                { status: 400 }
            );
        }

        // Create topic node and optionally link it to a parent topic
        const newTopic = await prisma.node.create({
            data: {
                type: 'topic',
                title: data.title,
                description: data.description || null,
                ...(data.parentId && {
                    asChild: {
                        create: { parentId: data.parentId }
                    }
                })
            },
        });

        return NextResponse.json({ success: true, topic: newTopic }, { status: 201 });

    } catch (error) {
        console.error('Failed to create topic:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

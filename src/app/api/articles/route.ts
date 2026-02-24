import { NextResponse } from 'next/server';
import { createNode, Node } from '../../../data/mockDB';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Validate required fields
        if (!data.title || !data.content || !data.parentId) {
            return NextResponse.json(
                { error: 'Missing required fields (title, content, parentId)' },
                { status: 400 }
            );
        }

        // Generate unique ID
        const newId = `art-${Date.now()}`;

        // Create new article Node
        const newNode: Node = {
            id: newId,
            type: 'article',
            title: data.title,
            content: data.content,
        };

        // Save to DB and link it to the selected Topic parent
        const savedNode = createNode(newNode, data.parentId);

        return NextResponse.json({ success: true, article: savedNode }, { status: 201 });

    } catch (error) {
        console.error('Failed to save article:', error);
        return NextResponse.json(
            { error: 'Internal server error while saving.' },
            { status: 500 }
        );
    }
}

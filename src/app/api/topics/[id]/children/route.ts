import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { TaxonomyLink, Node } from '@prisma/client';

type LinkWithChild = TaxonomyLink & { child: Node };

// GET /api/topics/[id]/children — get all direct children of a topic
export async function GET(_: Request, { params }: { params: { id: string } }) {
    const links = await prisma.taxonomyLink.findMany({
        where: { parentId: params.id },
        include: { child: true },
    });
    const children = (links as LinkWithChild[]).map(l => l.child);
    return NextResponse.json(children);
}

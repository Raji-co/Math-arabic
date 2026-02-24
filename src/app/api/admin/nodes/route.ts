import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

// GET /api/admin/nodes - all nodes with author info
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const nodes = await prisma.node.findMany({
        orderBy: { updatedAt: 'desc' },
        include: { author: { select: { name: true } } },
    });

    return NextResponse.json(nodes);
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth';
import { prisma } from '../../../../../../lib/prisma';

// PATCH /api/admin/nodes/[id]/status — update node status (admin)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { status } = await request.json();
    const allowed = ['draft', 'pending', 'published'];
    if (!allowed.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const node = await prisma.node.update({
        where: { id: params.id },
        data: { status },
    });

    return NextResponse.json(node);
}

// DELETE /api/admin/nodes/[id]/status — delete a node
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.node.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
}

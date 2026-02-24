import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

// DELETE /api/admin/users/[id]
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prevent deleting admin accounts
    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user || user.role === 'admin') {
        return NextResponse.json({ error: 'Cannot delete admin accounts' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
}

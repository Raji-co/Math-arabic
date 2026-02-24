import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

// GET /api/contributor/submit/[id] — contributor submits their draft for admin review
// Using GET so it can be triggered by a plain link (no client-side JS required)
export async function GET(_: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL));
    }

    const userId = (session.user as { id: string }).id;
    const node = await prisma.node.findUnique({ where: { id: params.id } });

    if (!node || node.authorId !== userId) {
        return NextResponse.json({ error: 'Not found or not yours' }, { status: 403 });
    }

    if (node.status !== 'draft') {
        return NextResponse.json({ error: 'Can only submit drafts' }, { status: 400 });
    }

    await prisma.node.update({
        where: { id: params.id },
        data: { status: 'pending' },
    });

    return NextResponse.redirect(new URL('/dashboard', process.env.NEXTAUTH_URL));
}

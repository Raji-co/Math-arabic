import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

// GET /api/admin/users — list all users
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { nodes: true } } },
    });

    return NextResponse.json(users);
}

// POST /api/admin/users — create a contributor
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
        return NextResponse.json({ error: 'يرجى ملء جميع الحقول' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json({ error: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { name, email, passwordHash, role: 'contributor' },
        select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(user, { status: 201 });
}

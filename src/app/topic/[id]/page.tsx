import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '../../../lib/prisma';
import { Node } from '@prisma/client';
import TopicFolder from '../../../components/TopicFolder';
import { ChevronLeft } from 'lucide-react';

// Get all ancestors of a node for breadcrumbs (walks up hierarchy)
async function getBreadcrumbs(nodeId: string): Promise<Node[]> {
    const breadcrumbs: Node[] = [];
    const ids: string[] = [nodeId];
    let scanId: string = nodeId;

    // Walk up max 10 levels to prevent infinite loops
    for (let i = 0; i < 10; i++) {
        const link: { parentId: string } | null = await prisma.taxonomyLink.findFirst({
            where: { childId: scanId },
            select: { parentId: true },
        });
        if (!link) break;
        ids.unshift(link.parentId);
        scanId = link.parentId;
    }

    for (const id of ids) {
        const node = await prisma.node.findUnique({ where: { id } });
        if (node) breadcrumbs.push(node);
    }
    return breadcrumbs;
}

export default async function TopicPage({ params }: { params: { id: string } }) {
    const topic = await prisma.node.findUnique({ where: { id: params.id } });

    if (!topic || topic.type !== 'topic') {
        notFound();
    }

    // Get all direct children of this topic
    const childLinks = await prisma.taxonomyLink.findMany({ where: { parentId: topic.id } });
    const childIds = childLinks.map(l => l.childId);
    const childrenNodes = await prisma.node.findMany({ where: { id: { in: childIds } } });

    const breadcrumbs = await getBreadcrumbs(topic.id);

    return (
        <div className="container py-8 max-w-4xl mx-auto px-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
                <Link href="/" className="hover:text-serlo-blue transition-colors">الرئيسية</Link>
                {breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={crumb.id}>
                        <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                        {idx === breadcrumbs.length - 1 ? (
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{crumb.title}</span>
                        ) : (
                            <Link href={`/topic/${crumb.id}`} className="hover:text-serlo-blue transition-colors">
                                {crumb.title}
                            </Link>
                        )}
                    </React.Fragment>
                ))}
            </nav>

            {/* Topic Folder View */}
            <TopicFolder topic={topic as any} childrenNodes={childrenNodes as any} />

            {/* Teacher Actions */}
            <div className="mt-6 flex gap-3 justify-end">
                <Link
                    href={`/editor?parentId=${topic.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-serlo-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    + إضافة درس هنا
                </Link>
                <Link
                    href={`/admin/create-topic?parentId=${topic.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-serlo-blue text-serlo-blue rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                    + إنشاء موضوع فرعي
                </Link>
            </div>
        </div>
    );
}

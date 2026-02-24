import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MOCK_NODES, MOCK_LINKS, Node } from '../../../data/mockDB';
import TopicFolder from '../../../components/TopicFolder';
import { ChevronLeft } from 'lucide-react';

// Helper to get a node by ID
const getNode = (id: string) => MOCK_NODES.find(n => n.id === id);

// Helper to get children of a node
const getChildren = (parentId: string): Node[] => {
    const childIds = MOCK_LINKS.filter(link => link.parentId === parentId).map(l => l.childId);
    return MOCK_NODES.filter(n => childIds.includes(n.id));
};

// Helper for simple breadcrumbs (Walks up the tree)
const getBreadcrumbs = (nodeId: string): Node[] => {
    const breadcrumbs: Node[] = [];
    let currentId: string | undefined = nodeId;

    while (currentId) {
        const node = getNode(currentId);
        if (node) {
            breadcrumbs.unshift(node); // Add to beginning
            // Find parent
            const link = MOCK_LINKS.find(l => l.childId === currentId);
            currentId = link?.parentId;
        } else {
            currentId = undefined;
        }
    }
    return breadcrumbs;
};

export default function TopicPage({ params }: { params: { id: string } }) {
    const topic = getNode(params.id);

    if (!topic || topic.type !== 'topic') {
        notFound();
    }

    const childrenNodes = getChildren(topic.id);
    const breadcrumbs = getBreadcrumbs(topic.id);

    return (
        <div className="container py-8 max-w-4xl mx-auto px-4">
            {/* Breadcrumbs Navigation */}
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

            {/* Main Topic Folder Component */}
            <TopicFolder topic={topic} childrenNodes={childrenNodes} />
        </div>
    );
}

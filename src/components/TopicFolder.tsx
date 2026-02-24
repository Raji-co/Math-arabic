import React from 'react';
import Link from 'next/link';
import { Node, NodeType } from '../data/mockDB';
import { FileText, PlayCircle, Box, FileEdit } from 'lucide-react';

interface TopicFolderProps {
    topic: Node;
    childrenNodes: Node[];
}

export default function TopicFolder({ topic, childrenNodes }: TopicFolderProps) {
    // Group children by type
    const articles = childrenNodes.filter(n => n.type === 'article');
    const videos = childrenNodes.filter(n => n.type === 'video');
    const applets = childrenNodes.filter(n => n.type === 'applet');
    const exercises = childrenNodes.filter(n => n.type === 'exercise');

    // Helper to render a section
    const renderSection = (title: string, icon: React.ReactNode, nodes: Node[]) => {
        if (nodes.length === 0) return null;

        return (
            <div className="mb-8 pl-4 border-l-2 border-gray-100 dark:border-gray-800 rtl:border-r-2 rtl:border-l-0 rtl:pr-4 rtl:pl-0">
                <h3 className="flex items-center gap-2 text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    {title} {icon}
                </h3>
                <ul className="space-y-3">
                    {nodes.map(node => (
                        <li key={node.id}>
                            <Link
                                href={`/${node.type}/${node.id}`}
                                className="text-serlo-blue hover:text-blue-700 hover:underline transition-colors duration-200 text-lg"
                            >
                                {node.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 doc-container p-8 md:p-12 mb-8 transition-all hover:shadow-md">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                    {topic.title}
                </h1>
                {topic.description && (
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        {topic.description}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-6">
                {renderSection('المقالات', <FileText className="w-6 h-6" />, articles)}
                {renderSection('مقاطع الفيديو', <PlayCircle className="w-6 h-6" />, videos)}
                {renderSection('التطبيقات', <Box className="w-6 h-6" />, applets)}
                {renderSection('التمارين', <FileEdit className="w-6 h-6" />, exercises)}
            </div>
        </div>
    );
}

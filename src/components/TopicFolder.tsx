'use client';

import React from 'react';
import Link from 'next/link';
import { Node } from '../data/mockDB';
import { FileText, PlayCircle, Box, FileEdit, Folder } from 'lucide-react';

interface TopicFolderProps {
    topic: Node;
    childrenNodes: Node[];
}

// CSS injected once at module level for hover effect on topic cards
const hoverStyle = `
.topic-folder-card:hover {
    border-color: #007ec1 !important;
    background: #e6f2f9 !important;
}
`;

export default function TopicFolder({ topic, childrenNodes }: TopicFolderProps) {
    const subTopics = childrenNodes.filter(n => n.type === 'topic');
    const articles = childrenNodes.filter(n => n.type === 'article');
    const videos = childrenNodes.filter(n => n.type === 'video');
    const applets = childrenNodes.filter(n => n.type === 'applet');
    const exercises = childrenNodes.filter(n => n.type === 'exercise');

    const hasContent = subTopics.length + articles.length + videos.length + applets.length + exercises.length > 0;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 doc-container p-8 md:p-12 mb-8 transition-all hover:shadow-md">
            <style>{hoverStyle}</style>

            {/* Header */}
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

            {!hasContent && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
                    <p>لا يوجد محتوى في هذا الموضوع بعد.</p>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Sub-topics: grid of folder cards */}
                {subTopics.length > 0 && (
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: '700', color: '#1a202c', marginBottom: '1rem', direction: 'rtl' }}>
                            <Folder style={{ width: '1.25rem', height: '1.25rem', color: '#007ec1' }} />
                            المواضيع الفرعية
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.875rem' }}>
                            {subTopics.map(node => (
                                <Link
                                    key={node.id}
                                    href={`/topic/${node.id}`}
                                    className="topic-folder-card"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '1rem 1.125rem', background: '#f4f7fa',
                                        borderRadius: '12px', border: '1.5px solid #eaecf0',
                                        textDecoration: 'none', color: '#1a202c', fontWeight: '600',
                                        fontSize: '1rem', transition: 'all 0.15s',
                                    }}
                                >
                                    <span style={{ fontSize: '1.4rem' }}>📁</span>
                                    <span>{node.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {renderListSection('المقالات', <FileText style={{ width: '1.25rem', height: '1.25rem' }} />, articles, 'article')}
                {renderListSection('مقاطع الفيديو', <PlayCircle style={{ width: '1.25rem', height: '1.25rem' }} />, videos, 'video')}
                {renderListSection('التطبيقات', <Box style={{ width: '1.25rem', height: '1.25rem' }} />, applets, 'applet')}
                {renderListSection('التمارين', <FileEdit style={{ width: '1.25rem', height: '1.25rem' }} />, exercises, 'exercise')}
            </div>
        </div>
    );
}

function renderListSection(title: string, icon: React.ReactNode, nodes: Node[], type: string) {
    if (nodes.length === 0) return null;
    return (
        <div style={{ paddingRight: '1rem', borderRight: '3px solid #eaecf0' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: '700', color: '#4a5568', marginBottom: '0.875rem', direction: 'rtl' }}>
                {icon} {title}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {nodes.map(node => (
                    <li key={node.id}>
                        <Link
                            href={`/${type}/${node.id}`}
                            style={{ color: '#007ec1', fontSize: '1.05rem', fontWeight: '500', textDecoration: 'none' }}
                        >
                            {node.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

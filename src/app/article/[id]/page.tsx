import React from 'react';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

import ClientRenderer from '../../../components/ClientRenderer';
const prisma = new PrismaClient();

async function getArticle(id: string) {
    try {
        const article = await prisma.article.findUnique({
            where: { id: parseInt(id, 10) },
        });
        return article;
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
    // Await the params object before using its properties
    const resolvedParams = await Promise.resolve(params);
    const article = await getArticle(resolvedParams.id);

    if (!article) {
        notFound();
    }

    // Parse the content string back into JSON
    let contentState;
    try {
        contentState = JSON.parse(article.content);
    } catch (e) {
        contentState = article.content; // fallback if it's already an object somehow
    }

    return (
        <div className="container" style={{ padding: '2rem 20px', maxWidth: '800px' }}>
            <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h1 style={{ color: 'var(--serlo-blue)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    {article.title}
                </h1>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    <span>المادة: {article.subject}</span>
                    <span style={{ margin: '0 10px' }}>|</span>
                    <span>تاريخ النشر: {new Date(article.createdAt).toLocaleDateString('ar-EG')}</span>
                </div>
            </header>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <ClientRenderer document={contentState} />
            </div>
        </div>
    );
}

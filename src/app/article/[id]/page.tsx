import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '../../../lib/prisma';
import { ChevronLeft, Clock, BookOpen, Eye } from 'lucide-react';
import ArticleContent from '../../../components/ArticleContent';

// Walk the full ancestor chain for breadcrumbs
async function getAncestors(nodeId: string) {
    const ancestors: { id: string; title: string; type: string }[] = [];
    let currentId = nodeId;

    for (let i = 0; i < 10; i++) {
        const link = await prisma.taxonomyLink.findFirst({
            where: { childId: currentId },
            include: { parent: { select: { id: true, title: true, type: true } } },
        });
        if (!link) break;
        ancestors.unshift(link.parent);
        currentId = link.parent.id;
    }
    return ancestors;
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
    const article = await prisma.node.findUnique({ where: { id: params.id } });

    if (!article || article.type !== 'article') notFound();

    const ancestors = await getAncestors(article.id);

    return (
        <div style={{ minHeight: '100vh', background: '#f7f9fc', direction: 'rtl' }}>
            <div style={{ maxWidth: '820px', margin: '0 auto', padding: '2rem 1.5rem' }}>

                {/* ── Breadcrumbs ── */}
                <nav style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem', fontSize: '0.85rem', color: '#718096', marginBottom: '1.5rem', direction: 'rtl' }}>
                    <Link href="/" style={{ color: '#718096', textDecoration: 'none' }}>الرئيسية</Link>
                    {ancestors.map((ancestor) => (
                        <React.Fragment key={ancestor.id}>
                            <ChevronLeft style={{ width: '14px', height: '14px', transform: 'rotate(180deg)' }} />
                            <Link
                                href={`/topic/${ancestor.id}`}
                                style={{ color: '#718096', textDecoration: 'none' }}
                            >
                                {ancestor.title}
                            </Link>
                        </React.Fragment>
                    ))}
                    <ChevronLeft style={{ width: '14px', height: '14px', transform: 'rotate(180deg)' }} />
                    <span style={{ color: '#1a202c', fontWeight: '600' }}>{article.title}</span>
                </nav>

                {/* ── Article card ── */}
                <article style={{
                    background: 'white', borderRadius: '16px',
                    border: '1px solid #eaecf0', overflow: 'hidden',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                }}>
                    {/* Header */}
                    <div style={{ padding: '2rem 2.5rem 1.5rem', borderBottom: '1px solid #f0f2f5' }}>
                        {/* Status badge */}
                        {article.status !== 'published' && (
                            <span style={{
                                display: 'inline-block', marginBottom: '0.75rem',
                                padding: '0.2rem 0.75rem', borderRadius: '999px',
                                fontSize: '0.75rem', fontWeight: '700',
                                background: article.status === 'draft' ? '#fff7ed' : '#fef9c3',
                                color: article.status === 'draft' ? '#c2410c' : '#854d0e',
                                border: `1px solid ${article.status === 'draft' ? '#fed7aa' : '#fef08a'}`,
                            }}>
                                {article.status === 'draft' ? '✏️ مسودة' : '⏳ قيد المراجعة'}
                            </span>
                        )}

                        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1a202c', lineHeight: '1.3', marginBottom: '0.875rem' }}>
                            {article.title}
                        </h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: '#718096', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Clock style={{ width: '14px', height: '14px' }} />
                                {new Date(article.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <BookOpen style={{ width: '14px', height: '14px' }} />
                                {ancestors.map(a => a.title).join(' › ')}
                            </span>
                        </div>
                    </div>

                    {/* Content area */}
                    <div style={{ padding: '2rem 2.5rem' }}>
                        {article.content ? (
                            <ArticleContent content={article.content} />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0aec0' }}>
                                <Eye style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.4 }} />
                                <p>لا يوجد محتوى بعد.</p>
                            </div>
                        )}
                    </div>
                </article>

                {/* ── Navigation ── */}
                {ancestors.length > 0 && (
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
                        <Link
                            href={`/topic/${ancestors[ancestors.length - 1].id}`}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.625rem 1.25rem', borderRadius: '10px',
                                border: '1.5px solid #e2e8f0', background: 'white',
                                color: '#4a5568', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem',
                            }}
                        >
                            ← العودة إلى {ancestors[ancestors.length - 1].title}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

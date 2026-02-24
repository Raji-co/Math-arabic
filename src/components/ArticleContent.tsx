'use client';

import dynamic from 'next/dynamic';

const SerloRenderer = dynamic(
    () => import('@serlo/editor').then(m => m.SerloRenderer),
    { ssr: false, loading: () => <div style={{ color: '#999', padding: '1rem' }}>جاري تحميل المحتوى...</div> }
);

interface ArticleContentProps {
    content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
    let state: unknown = null;
    try {
        state = JSON.parse(content);
    } catch {
        state = {
            plugin: 'rows',
            state: [{ plugin: 'text', state: [{ type: 'p', children: [{ text: content }] }] }],
        };
    }

    return (
        <div className="serlo-renderer-wrapper" dir="rtl">
            <SerloRenderer
                language="en"
                editorVariant="serlo-org"
                state={state}
            />
        </div>
    );
}

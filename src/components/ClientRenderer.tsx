'use client';

import dynamic from 'next/dynamic';

const SerloRenderer = dynamic(() => import('@serlo/editor').then((mod) => mod.SerloRenderer), { ssr: false });

export default function ClientRenderer({ document }: { document: any }) {
    return (
        <div dir="ltr" className="serlo-editor-wrapper">
            <SerloRenderer language="en" state={document} editorVariant="serlo-org" />
        </div>
    );
}

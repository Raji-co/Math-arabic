'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
// Dynamically import Serlo Editor to avoid SSR issues
import dynamic from 'next/dynamic';

const SerloEditor = dynamic(() => import('@serlo/editor').then((mod) => mod.SerloEditor), { ssr: false });

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
`;

const Title = styled.h1`
  color: var(--serlo-dark);
  font-size: 2rem;
`;

const TitleInput = styled.input`
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--serlo-blue);
    box-shadow: 0 0 0 2px var(--serlo-light-blue);
  }
`;

const SaveButton = styled.button`
  background: var(--serlo-green);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #84a81b;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const EditorContainer = styled.div`
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
  min-height: 500px;
  box-shadow: var(--shadow-sm);
`;

const INITIAL_EDITOR_STATE = {
    plugin: 'rows',
    state: [
        {
            plugin: 'text',
            state: [
                {
                    type: 'p',
                    children: [{ text: 'ابدأ بكتابة الدرس هنا...' }],
                },
            ],
        },
    ],
};

export default function EditorPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [parentId, setParentId] = useState('topic-coordinate-system'); // Default to a known topic
    const [isSaving, setIsSaving] = useState(false);
    const [editorState, setEditorState] = useState<any>(null);

    const handleSave = async () => {
        if (!editorState) return;

        setIsSaving(true);
        try {
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title || 'درس جديد',
                    parentId: parentId,
                    content: editorState,
                }),
            });

            if (response.ok) {
                // Since user didn't want article reader yet, redirect to the topic page to verify it was added
                router.push(`/topic/${parentId}`);
            } else {
                console.error('Failed to save');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <PageContainer>
            <Header>
                <Title>إنشاء محتوى جديد</Title>
                <SaveButton onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'جاري الحفظ...' : 'حفظ ونشر'}
                </SaveButton>
            </Header>

            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <TitleInput
                    placeholder="عنوان الدرس..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ flex: 1 }}
                />

                <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        fontSize: '1.25rem',
                        fontFamily: 'inherit',
                        backgroundColor: 'white'
                    }}
                >
                    <option value="topic-geometry">الهندسة</option>
                    <option value="topic-coordinate-system">نظام الإحداثيات (الهندسة)</option>
                    <option value="topic-math">الرياضيات (عام)</option>
                </select>
            </div>

            <EditorContainer>
                {/* Render Serlo Editor in LTR context to fix its toolbars, but we will force the content to be RTL in CSS */}
                <div dir="ltr" className="serlo-editor-wrapper">
                    <SerloEditor
                        language="en"
                        editorVariant="serlo-org"
                        initialState={INITIAL_EDITOR_STATE}
                        onChange={(state) => setEditorState(state)}
                    >
                        <div />
                    </SerloEditor>
                </div>
            </EditorContainer>
        </PageContainer>
    );
}

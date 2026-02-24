'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const SerloEditor = dynamic(() => import('@serlo/editor').then((mod) => mod.SerloEditor), { ssr: false });

/* ─────────────────────────── types ──────────────────────────── */
interface TopicNode { id: string; title: string; type: string; description?: string | null; }

/* ─────────────────────────── constants ────────────────────────── */
const ROOT_MATH_ID = 'topic-math';

const INITIAL_EDITOR_STATE = {
    plugin: 'rows',
    state: [
        {
            plugin: 'text',
            state: [{ type: 'p', children: [{ text: 'ابدأ بكتابة المقالة هنا...' }] }],
        },
    ],
};

/* ─────────────────────────── step labels ──────────────────────── */
const STEPS = ['اختر الفرع', 'اختر الموضوع', 'اكتب المقالة'];

/* ═══════════════════════════════════════════════════════════════ */
function EditorInner() {
    const router = useRouter();

    // Step: 1 = branch, 2 = subtopic, 3 = write
    const [step, setStep] = useState(1);

    // Selections
    const [branches, setBranches] = useState<TopicNode[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<TopicNode | null>(null);
    const [subtopics, setSubtopics] = useState<TopicNode[]>([]);
    const [selectedSubtopic, setSelectedSubtopic] = useState<TopicNode | null>(null);

    // New-subject request
    const [showRequest, setShowRequest] = useState(false);
    const [requestTitle, setRequestTitle] = useState('');
    const [requestDesc, setRequestDesc] = useState('');
    const [requestSent, setRequestSent] = useState(false);
    const [requestSaving, setRequestSaving] = useState(false);

    // Article form
    const [title, setTitle] = useState('');
    const [editorState, setEditorState] = useState<unknown>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    // Load top-level math branches on mount
    useEffect(() => {
        fetch(`/api/topics/${ROOT_MATH_ID}/children`)
            .then(r => r.json())
            .then((data: TopicNode[]) => setBranches(data.filter(n => n.type === 'topic')));
    }, []);

    // Load subtopics when branch selected
    useEffect(() => {
        if (!selectedBranch) return;
        setSubtopics([]);
        setSelectedSubtopic(null);
        fetch(`/api/topics/${selectedBranch.id}/children`)
            .then(r => r.json())
            .then((data: TopicNode[]) => setSubtopics(data.filter(n => n.type === 'topic')));
    }, [selectedBranch]);

    /* ── Step 1: pick branch ── */
    function handleBranchSelect(branch: TopicNode) {
        setSelectedBranch(branch);
        setShowRequest(false);
        setRequestSent(false);
        setStep(2);
    }

    /* ── Step 2: pick subtopic or request new ── */
    function handleSubtopicSelect(sub: TopicNode) {
        setSelectedSubtopic(sub);
        setShowRequest(false);
        setStep(3);
    }

    /* ── Request new subject (creates a draft topic linked to the selected branch) ── */
    async function handleRequestSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedBranch) return;
        setRequestSaving(true);
        await fetch('/api/topics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: requestTitle, description: requestDesc, parentId: selectedBranch.id }),
        });
        setRequestSaving(false);
        setRequestSent(true);
    }

    /* ── Save article ── */
    async function handleSave(status: 'draft' | 'pending') {
        if (!editorState || !selectedSubtopic) return;
        setIsSaving(true);
        setSaveError('');
        try {
            const res = await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title || 'مقالة جديدة',
                    parentId: selectedSubtopic.id,
                    content: editorState,
                    status,
                }),
            });
            if (res.ok) {
                router.push(`/topic/${selectedSubtopic.id}`);
            } else {
                setSaveError('فشل في حفظ المقالة. حاول مرة أخرى.');
            }
        } catch {
            setSaveError('حدث خطأ غير متوقع.');
        } finally {
            setIsSaving(false);
        }
    }

    /* ─── shared card style ─── */
    const card = (active = false): React.CSSProperties => ({
        display: 'flex', alignItems: 'center', gap: '0.875rem',
        padding: '1rem 1.25rem', borderRadius: '12px', cursor: 'pointer',
        border: `2px solid ${active ? '#007ec1' : '#e2e8f0'}`,
        background: active ? '#e6f2f9' : 'white',
        fontWeight: '600', fontSize: '1rem', color: active ? '#005a8e' : '#1a202c',
        transition: 'all 0.15s', textAlign: 'right' as const, direction: 'rtl' as const,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    });

    const BRANCH_ICONS: Record<string, string> = {
        'topic-algebra': '✖️',
        'topic-geometry': '📐',
        'topic-calculus': '∫',
        'topic-statistics': '📊',
    };

    /* ════════════════════════ render ════════════════════════ */
    return (
        <div style={{ minHeight: '100vh', background: '#f4f7fa', direction: 'rtl' }}>

            {/* ── top bar ── */}
            <div style={{ background: 'white', borderBottom: '1px solid #eaecf0', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <a href="/" style={{ color: '#007ec1', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem' }}>Serlo بالعربي</a>
                    <span style={{ color: '#ccc' }}>›</span>
                    <span style={{ color: '#555', fontWeight: '600' }}>إنشاء مقالة جديدة</span>
                </div>
                {step > 1 && (
                    <button onClick={() => { setStep(s => s - 1); setShowRequest(false); }}
                        style={{ background: 'none', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '0.45rem 1rem', cursor: 'pointer', color: '#555', fontFamily: 'inherit', fontWeight: '600' }}>
                        ← السابق
                    </button>
                )}
            </div>

            {/* ── stepper ── */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 2rem 0', gap: '0' }}>
                {STEPS.map((label, i) => {
                    const num = i + 1;
                    const done = step > num;
                    const active = step === num;
                    return (
                        <React.Fragment key={label}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: done ? '#95c11f' : active ? '#007ec1' : '#e2e8f0',
                                    color: done || active ? 'white' : '#999', fontWeight: '700', fontSize: '0.9rem',
                                    transition: 'all 0.2s',
                                }}>
                                    {done ? '✓' : num}
                                </div>
                                <span style={{ fontSize: '0.78rem', color: active ? '#007ec1' : done ? '#95c11f' : '#999', fontWeight: active ? '700' : '500', whiteSpace: 'nowrap' }}>
                                    {label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div style={{ flex: 1, height: '2px', background: done ? '#95c11f' : '#e2e8f0', marginTop: '17px', maxWidth: '80px', transition: 'background 0.3s' }} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* ── content ── */}
            <div style={{ maxWidth: '680px', margin: '2rem auto', padding: '0 1.5rem' }}>

                {/* STEP 1: choose branch */}
                {step === 1 && (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #eaecf0' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.4rem', color: '#1a202c' }}>في أي فرع تريد إضافة مقالة؟</h2>
                        <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.95rem' }}>اختر الفرع المناسب للمحتوى الذي ستكتبه</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            {branches.length === 0
                                ? <p style={{ color: '#999', gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>جاري التحميل...</p>
                                : branches.map(b => (
                                    <button key={b.id} onClick={() => handleBranchSelect(b)} style={card(selectedBranch?.id === b.id)}>
                                        <span style={{ fontSize: '1.6rem' }}>{BRANCH_ICONS[b.id] || '📚'}</span>
                                        <div style={{ textAlign: 'right' }}>
                                            <div>{b.title}</div>
                                            {b.description && <div style={{ fontSize: '0.78rem', color: '#718096', fontWeight: '400', marginTop: '0.1rem' }}>{b.description}</div>}
                                        </div>
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                )}

                {/* STEP 2: choose subtopic */}
                {step === 2 && selectedBranch && (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #eaecf0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '1.4rem' }}>{BRANCH_ICONS[selectedBranch.id] || '📚'}</span>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1a202c', margin: 0 }}>
                                ما الموضوع داخل {selectedBranch.title}؟
                            </h2>
                        </div>
                        <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.95rem' }}>اختر الموضوع الذي تريد إضافة مقالة إليه</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
                            {subtopics.length === 0
                                ? <p style={{ color: '#999', textAlign: 'center', padding: '1rem' }}>جاري التحميل...</p>
                                : subtopics.map(s => (
                                    <button key={s.id} onClick={() => handleSubtopicSelect(s)} style={card(selectedSubtopic?.id === s.id)}>
                                        <span style={{ fontSize: '1.25rem' }}>📁</span>
                                        <div style={{ textAlign: 'right' }}>
                                            <div>{s.title}</div>
                                            {s.description && <div style={{ fontSize: '0.78rem', color: '#718096', fontWeight: '400', marginTop: '0.1rem' }}>{s.description}</div>}
                                        </div>
                                    </button>
                                ))
                            }
                        </div>

                        {/* Divider */}
                        <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '1.25rem' }}>
                            <button
                                onClick={() => { setShowRequest(r => !r); setRequestSent(false); }}
                                style={{ background: 'none', border: '1.5px dashed #cbd5e0', borderRadius: '10px', padding: '0.75rem 1rem', cursor: 'pointer', color: '#555', fontFamily: 'inherit', fontWeight: '600', width: '100%', textAlign: 'right', direction: 'rtl' }}
                            >
                                {showRequest ? '↑ إلغاء' : '+ موضوعي غير موجود — اطلب إضافته'}
                            </button>

                            {showRequest && !requestSent && (
                                <form onSubmit={handleRequestSubmit} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.35rem', fontSize: '0.9rem', color: '#333' }}>اسم الموضوع الجديد *</label>
                                        <input
                                            type="text" required value={requestTitle}
                                            onChange={e => setRequestTitle(e.target.value)}
                                            placeholder="مثال: المصفوفات والمحددات"
                                            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', direction: 'rtl' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.35rem', fontSize: '0.9rem', color: '#333' }}>وصف مختصر (اختياري)</label>
                                        <textarea
                                            value={requestDesc} onChange={e => setRequestDesc(e.target.value)}
                                            placeholder="اشرح ما يتضمنه هذا الموضوع..."
                                            rows={2}
                                            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', direction: 'rtl', resize: 'vertical' }}
                                        />
                                    </div>
                                    <button type="submit" disabled={requestSaving}
                                        style={{ background: '#007ec1', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '700', alignSelf: 'flex-start' }}>
                                        {requestSaving ? 'جاري الإرسال...' : 'إرسال الطلب'}
                                    </button>
                                </form>
                            )}

                            {requestSent && (
                                <div style={{ marginTop: '1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1rem 1.25rem', color: '#166534' }}>
                                    <strong>✅ تم إرسال طلبك!</strong>
                                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                                        سيراجع الفريق اقتراحك وسيُضاف الموضوع عند الموافقة عليه. يمكنك في هذه الأثناء إنشاء المقالة تحت موضوع قريب.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 3: write the article */}
                {step === 3 && selectedSubtopic && (
                    <div>
                        {/* Context breadcrumb */}
                        <div style={{ background: '#e6f2f9', border: '1px solid #c3dff0', borderRadius: '10px', padding: '0.75rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#005a8e', fontWeight: '600' }}>
                            <span>{BRANCH_ICONS[selectedBranch!.id] || '📚'}</span>
                            <span>{selectedBranch!.title}</span>
                            <span style={{ color: '#93c5da' }}>›</span>
                            <span>📁 {selectedSubtopic.title}</span>
                        </div>

                        {/* Article form */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #eaecf0', marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem', color: '#333' }}>عنوان المقالة</label>
                            <input
                                type="text"
                                placeholder="أدخل عنواناً واضحاً ومعبّراً..."
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                style={{
                                    width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                                    border: '1.5px solid #e2e8f0', fontSize: '1.1rem', fontFamily: 'inherit',
                                    direction: 'rtl', outline: 'none', marginBottom: '0',
                                }}
                            />
                        </div>

                        {/* Editor */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #eaecf0', minHeight: '400px' }}>
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
                        </div>

                        {/* Save buttons */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
                            {saveError && <span style={{ color: '#dc2626', fontSize: '0.875rem', alignSelf: 'center' }}>⚠️ {saveError}</span>}
                            <button
                                onClick={() => handleSave('draft')}
                                disabled={isSaving}
                                style={{ background: 'white', border: '1.5px solid #e2e8f0', padding: '0.75rem 1.5rem', borderRadius: '10px', cursor: isSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: '700', color: '#555', fontSize: '0.95rem' }}
                            >
                                💾 حفظ كمسودة
                            </button>
                            <button
                                onClick={() => handleSave('pending')}
                                disabled={isSaving}
                                style={{ background: isSaving ? '#93c5da' : 'linear-gradient(135deg, #007ec1, #0097d6)', color: 'white', border: 'none', padding: '0.75rem 1.75rem', borderRadius: '10px', cursor: isSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: '700', fontSize: '0.95rem' }}
                            >
                                {isSaving ? 'جاري الحفظ...' : '🚀 إرسال للمراجعة'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function EditorPage() {
    return (
        <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center' }}>جاري التحميل...</div>}>
            <EditorInner />
        </Suspense>
    );
}

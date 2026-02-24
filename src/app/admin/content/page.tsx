'use client';

import { useEffect, useState } from 'react';

type Article = {
    id: string;
    title: string;
    type: string;
    status: string;
    createdAt: string;
    author?: { name: string } | null;
};

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'مسودة', color: '#6b7280', bg: '#f3f4f6' },
    pending: { label: 'قيد المراجعة', color: '#d97706', bg: '#fef3c7' },
    published: { label: 'منشور', color: '#059669', bg: '#d1fae5' },
};

export default function ContentPage() {
    const [nodes, setNodes] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    async function fetchNodes() {
        setLoading(true);
        const res = await fetch('/api/admin/nodes');
        const data = await res.json();
        setNodes(data);
        setLoading(false);
    }

    useEffect(() => { fetchNodes(); }, []);

    async function updateStatus(id: string, status: string) {
        await fetch(`/api/admin/nodes/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        fetchNodes();
    }

    async function deleteNode(id: string) {
        if (!confirm('هل أنت متأكد من حذف هذا المحتوى؟')) return;
        await fetch(`/api/admin/nodes/${id}/status`, { method: 'DELETE' });
        fetchNodes();
    }

    const filtered = filter === 'all' ? nodes : nodes.filter(n => n.status === filter);

    return (
        <div style={{ direction: 'rtl' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1a202c', marginBottom: '0.35rem' }}>
                إدارة المحتوى
            </h1>
            <p style={{ color: '#718096', marginBottom: '1.75rem' }}>مراجعة ونشر وحذف المقالات والمواضيع</p>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {[['all', 'الكل'], ['pending', 'قيد المراجعة'], ['published', 'منشور'], ['draft', 'مسودة']].map(([val, lbl]) => (
                    <button key={val} onClick={() => setFilter(val)}
                        style={{
                            padding: '0.5rem 1rem', borderRadius: '8px', border: '1.5px solid',
                            cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: '600',
                            background: filter === val ? '#007ec1' : 'white',
                            color: filter === val ? 'white' : '#555',
                            borderColor: filter === val ? '#007ec1' : '#e2e8f0',
                            transition: 'all 0.15s',
                        }}
                    >{lbl}</button>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #eaecf0', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>جاري التحميل...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>لا يوجد محتوى في هذا القسم</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #eaecf0' }}>
                                {['العنوان', 'النوع', 'المساهم', 'الحالة', 'إجراءات'].map(h => (
                                    <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: 'right', fontSize: '0.85rem', fontWeight: '700', color: '#718096' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(node => {
                                const st = STATUS_LABELS[node.status] || STATUS_LABELS.draft;
                                return (
                                    <tr key={node.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                                        <td style={{ padding: '1rem 1.25rem', fontWeight: '600', color: '#1a202c', maxWidth: '280px' }}>
                                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.title}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#555', fontSize: '0.9rem' }}>
                                            {node.type === 'article' ? '📝 مقالة' : '📁 موضوع'}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#555', fontSize: '0.9rem' }}>
                                            {node.author?.name || '—'}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span style={{ background: st.bg, color: st.color, padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '600' }}>
                                                {st.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {node.status !== 'published' && (
                                                    <button onClick={() => updateStatus(node.id, 'published')}
                                                        style={{ padding: '0.375rem 0.75rem', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: '600' }}>
                                                        نشر ✓
                                                    </button>
                                                )}
                                                {node.status === 'published' && (
                                                    <button onClick={() => updateStatus(node.id, 'draft')}
                                                        style={{ padding: '0.375rem 0.75rem', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: '600' }}>
                                                        إلغاء نشر
                                                    </button>
                                                )}
                                                <button onClick={() => deleteNode(node.id)}
                                                    style={{ padding: '0.375rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: '600' }}>
                                                    حذف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

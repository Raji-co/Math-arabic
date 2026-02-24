'use client';

import { useEffect, useState } from 'react';

type Contributor = {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    _count?: { nodes: number };
};

export default function ContributorsPage() {
    const [users, setUsers] = useState<Contributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    async function fetchUsers() {
        setLoading(true);
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data);
        setLoading(false);
    }

    useEffect(() => { fetchUsers(); }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setFormError('');
        const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        setSaving(false);
        if (!res.ok) { setFormError(data.error || 'حدث خطأ'); return; }
        setForm({ name: '', email: '', password: '' });
        setShowForm(false);
        fetchUsers();
    }

    async function deleteUser(id: string) {
        if (!confirm('هل أنت متأكد من حذف هذا المساهم؟')) return;
        await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        fetchUsers();
    }

    return (
        <div style={{ direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>المساهمون</h1>
                    <p style={{ color: '#718096', marginTop: '0.35rem' }}>إدارة حسابات المساهمين في المنصة</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    style={{
                        background: '#007ec1', color: 'white', border: 'none',
                        padding: '0.75rem 1.25rem', borderRadius: '10px', cursor: 'pointer',
                        fontSize: '0.95rem', fontWeight: '700', fontFamily: 'inherit',
                    }}>
                    {showForm ? '✕ إلغاء' : '+ إضافة مساهم'}
                </button>
            </div>

            {/* Add form */}
            {showForm && (
                <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #eaecf0', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: '#1a202c' }}>مساهم جديد</h2>
                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            {[
                                { label: 'الاسم الكامل', key: 'name', type: 'text', placeholder: 'أحمد محمد' },
                                { label: 'البريد الإلكتروني', key: 'email', type: 'email', placeholder: 'ahmed@example.com' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#333' }}>{f.label}</label>
                                    <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                                        onChange={e => setForm({ ...form, [f.key]: e.target.value })} required
                                        style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', fontFamily: 'inherit', direction: f.key === 'email' ? 'ltr' : 'rtl' }} />
                                </div>
                            ))}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#333' }}>كلمة المرور</label>
                            <input type="password" placeholder="كلمة مرور قوية" value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6}
                                style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', fontFamily: 'inherit' }} />
                        </div>
                        {formError && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '0.75rem' }}>⚠️ {formError}</p>}
                        <button type="submit" disabled={saving}
                            style={{ background: '#007ec1', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '700' }}>
                            {saving ? 'جاري الحفظ...' : 'إنشاء الحساب'}
                        </button>
                    </form>
                </div>
            )}

            {/* Users table */}
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #eaecf0', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>جاري التحميل...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #eaecf0' }}>
                                {['الاسم', 'البريد الإلكتروني', 'الدور', 'المحتوى', 'إجراءات'].map(h => (
                                    <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: 'right', fontSize: '0.85rem', fontWeight: '700', color: '#718096' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                                    <td style={{ padding: '1rem 1.25rem', fontWeight: '600', color: '#1a202c' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e6f2f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#007ec1', fontWeight: '700', fontSize: '1rem' }}>
                                                {user.name[0]}
                                            </div>
                                            {user.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.25rem', color: '#555', fontSize: '0.9rem', direction: 'ltr', textAlign: 'right' }}>{user.email}</td>
                                    <td style={{ padding: '1rem 1.25rem' }}>
                                        <span style={{
                                            background: user.role === 'admin' ? '#ede9fe' : '#e6f2f9',
                                            color: user.role === 'admin' ? '#7c3aed' : '#007ec1',
                                            padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '700',
                                        }}>
                                            {user.role === 'admin' ? '👑 مدير' : '✏️ مساهم'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.25rem', color: '#555', fontSize: '0.9rem' }}>
                                        {user._count?.nodes ?? 0} محتوى
                                    </td>
                                    <td style={{ padding: '1rem 1.25rem' }}>
                                        {user.role !== 'admin' && (
                                            <button onClick={() => deleteUser(user.id)}
                                                style={{ padding: '0.375rem 0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: '600' }}>
                                                حذف
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

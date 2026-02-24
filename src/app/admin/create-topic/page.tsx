'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Topic {
    id: string;
    title: string;
    description: string | null;
}

export default function CreateTopicPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialParentId = searchParams.get('parentId') || '';

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState(initialParentId);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/topics').then(res => res.json()).then(setTopics);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) { setError('العنوان مطلوب'); return; }

        setIsSaving(true);
        setError('');

        try {
            const res = await fetch('/api/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, parentId: parentId || undefined }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(`✅ تم إنشاء "${title}" بنجاح!`);
                setTitle('');
                setDescription('');
                // Navigate to the new topic after a moment
                setTimeout(() => router.push(`/topic/${data.topic.id}`), 1500);
            } else {
                setError(data.error || 'حدث خطأ أثناء الإنشاء.');
            }
        } catch (err) {
            setError('تعذر الاتصال بالخادم.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">إنشاء موضوع جديد</h1>
                <p className="text-gray-500 mb-8">أضف مادة أو موضوعاً جديداً إلى منصة التعلم.</p>

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">عنوان الموضوع *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="مثال: الجبر، الإحصاء، الهندسة..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            dir="rtl"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">وصف مختصر (اختياري)</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="ما الذي يغطيه هذا الموضوع؟"
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                            dir="rtl"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">تابع لـ (موضوع رئيسي)</label>
                        <select
                            value={parentId}
                            onChange={e => setParentId(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                            dir="rtl"
                        >
                            <option value="">— موضوع مستقل (مستوى أعلى) —</option>
                            {topics.map(t => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-3 bg-serlo-blue text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'جاري الإنشاء...' : 'إنشاء الموضوع'}
                    </button>
                </form>
            </div>
        </div>
    );
}

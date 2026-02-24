import { prisma } from '../../lib/prisma';

async function getStats() {
    const [articles, topics, contributors, pending] = await Promise.all([
        prisma.node.count({ where: { type: 'article' } }),
        prisma.node.count({ where: { type: 'topic' } }),
        prisma.user.count({ where: { role: 'contributor' } }),
        prisma.node.count({ where: { status: 'pending' } }),
    ]);
    return { articles, topics, contributors, pending };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const statCards = [
        { label: 'المقالات', value: stats.articles, icon: '📝', color: '#007ec1' },
        { label: 'المواضيع', value: stats.topics, icon: '📁', color: '#95c11f' },
        { label: 'المساهمون', value: stats.contributors, icon: '👥', color: '#f59e0b' },
        { label: 'بانتظار المراجعة', value: stats.pending, icon: '⏳', color: '#ef4444' },
    ];

    return (
        <div style={{ direction: 'rtl' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>
                    لوحة التحكم
                </h1>
                <p style={{ color: '#718096', marginTop: '0.35rem' }}>نظرة عامة على منصة سيرلو العربية</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {statCards.map(card => (
                    <div key={card.label} style={{
                        background: 'white', borderRadius: '16px', padding: '1.5rem',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #eaecf0',
                        display: 'flex', alignItems: 'center', gap: '1rem',
                    }}>
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '12px',
                            background: `${card.color}18`, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                        }}>
                            {card.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: card.color, lineHeight: 1 }}>
                                {card.value}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                                {card.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #eaecf0' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a202c', marginBottom: '1rem' }}>
                    إجراءات سريعة
                </h2>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {[
                        { href: '/admin/content', label: '📋 مراجعة المحتوى المعلق', primary: true },
                        { href: '/admin/contributors', label: '👤 إضافة مساهم جديد', primary: false },
                        { href: '/editor', label: '✏️ إنشاء مقالة', primary: false },
                    ].map(action => (
                        <a key={action.href} href={action.href} style={{
                            padding: '0.625rem 1.25rem', borderRadius: '8px', textDecoration: 'none',
                            fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s',
                            background: action.primary ? '#007ec1' : '#f4f7fa',
                            color: action.primary ? 'white' : '#444',
                            border: action.primary ? 'none' : '1px solid #eaecf0',
                        }}>
                            {action.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

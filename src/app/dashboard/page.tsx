import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '../../lib/prisma';
import Link from 'next/link';
import SignOutButton from '../../components/SignOutButton';

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    draft: { label: 'مسودة', color: '#6b7280', bg: '#f3f4f6', icon: '✏️' },
    pending: { label: 'قيد المراجعة', color: '#d97706', bg: '#fef3c7', icon: '⏳' },
    published: { label: 'منشور', color: '#059669', bg: '#d1fae5', icon: '✅' },
};

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    const userId = (session.user as { id: string }).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const myNodes = await prisma.node.findMany({
        where: { authorId: userId },
        orderBy: { updatedAt: 'desc' },
    });

    const counts = {
        draft: myNodes.filter(n => n.status === 'draft').length,
        pending: myNodes.filter(n => n.status === 'pending').length,
        published: myNodes.filter(n => n.status === 'published').length,
    };

    const totalArticles = myNodes.filter(n => n.type === 'article').length;

    return (
        <div style={{ direction: 'rtl', minHeight: '100vh', background: '#f4f7fa', padding: '2rem' }}>

            {/* ── Top bar ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1a202c', margin: 0 }}>
                        مرحباً، {user?.name} 👋
                    </h1>
                    <p style={{ color: '#718096', marginTop: '0.25rem', margin: 0 }}>لوحة المساهم · {user?.email}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Link href="/" style={{ color: '#007ec1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
                        🏠 الموقع
                    </Link>
                    <Link href="/editor" style={{
                        background: 'linear-gradient(135deg, #007ec1, #0097d6)', color: 'white',
                        padding: '0.625rem 1.25rem', borderRadius: '8px', textDecoration: 'none',
                        fontWeight: '700', fontSize: '0.9rem',
                    }}>
                        ✏️ مقالة جديدة
                    </Link>
                    <SignOutButton />
                </div>
            </div>

            {/* ── Stats row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { label: 'المقالات الكلية', count: totalArticles, color: '#007ec1', icon: '📚', bg: '#e6f2f9' },
                    { label: 'المسودات', count: counts.draft, color: '#6b7280', icon: '📄', bg: '#f3f4f6' },
                    { label: 'قيد المراجعة', count: counts.pending, color: '#d97706', icon: '⏳', bg: '#fef3c7' },
                    { label: 'المنشورة', count: counts.published, color: '#059669', icon: '✅', bg: '#d1fae5' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: 'white', borderRadius: '14px', padding: '1.25rem 1.5rem',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #eaecf0',
                        display: 'flex', alignItems: 'center', gap: '1rem',
                    }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.count}</div>
                            <div style={{ fontSize: '0.8rem', color: '#718096' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Content list ── */}
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #eaecf0', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #eaecf0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a202c', margin: 0 }}>مقالاتي</h2>
                    {myNodes.length > 0 && (
                        <span style={{ fontSize: '0.85rem', color: '#718096' }}>{myNodes.length} مقالة</span>
                    )}
                </div>

                {myNodes.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#718096' }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✍️</div>
                        <p style={{ fontWeight: '600', fontSize: '1.05rem', marginBottom: '0.5rem' }}>لم تكتب أي مقالة بعد</p>
                        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>شارك معرفتك مع الطلاب العرب</p>
                        <Link href="/editor" style={{
                            display: 'inline-block', background: '#007ec1', color: 'white',
                            padding: '0.75rem 1.75rem', borderRadius: '10px', textDecoration: 'none', fontWeight: '700',
                        }}>
                            ابدأ بكتابة مقالة →
                        </Link>
                    </div>
                ) : (
                    <div>
                        {myNodes.map((node, i) => {
                            const st = STATUS_LABELS[node.status || 'draft'] || STATUS_LABELS.draft;
                            const isArticle = node.type === 'article';
                            return (
                                <div key={node.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    padding: '1rem 1.5rem',
                                    borderBottom: i < myNodes.length - 1 ? '1px solid #f0f2f5' : 'none',
                                    flexWrap: 'wrap',
                                }}>
                                    {/* Icon */}
                                    <div style={{ fontSize: '1.25rem', flexShrink: 0 }}>
                                        {isArticle ? '📝' : '📁'}
                                    </div>

                                    {/* Title */}
                                    <div style={{ flex: 1, minWidth: '160px' }}>
                                        {isArticle && node.status === 'published' ? (
                                            <Link href={`/article/${node.id}`} style={{ color: '#1a202c', fontWeight: '600', textDecoration: 'none' }}>
                                                {node.title}
                                            </Link>
                                        ) : (
                                            <span style={{ color: '#1a202c', fontWeight: '600' }}>{node.title}</span>
                                        )}
                                        <div style={{ fontSize: '0.78rem', color: '#a0aec0', marginTop: '0.15rem' }}>
                                            {new Date(node.updatedAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>

                                    {/* Status badge */}
                                    <span style={{
                                        background: st.bg, color: st.color,
                                        padding: '0.25rem 0.75rem', borderRadius: '20px',
                                        fontSize: '0.8rem', fontWeight: '600', whiteSpace: 'nowrap',
                                    }}>
                                        {st.icon} {st.label}
                                    </span>

                                    {/* Action: submit for review if draft */}
                                    {node.status === 'draft' && isArticle && (
                                        <form action={`/api/admin/nodes/${node.id}/status`} method="PATCH">
                                            <SubmitForReviewButton nodeId={node.id} />
                                        </form>
                                    )}

                                    {/* View link for published */}
                                    {node.status === 'published' && isArticle && (
                                        <Link href={`/article/${node.id}`} style={{
                                            fontSize: '0.82rem', color: '#007ec1', fontWeight: '600',
                                            textDecoration: 'none', whiteSpace: 'nowrap',
                                        }}>
                                            عرض →
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Tips card ── */}
            <div style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #e6f2f9, #eef6ff)', borderRadius: '14px', padding: '1.25rem 1.5rem', border: '1px solid #c3dff0' }}>
                <h3 style={{ fontWeight: '700', color: '#005a8e', marginBottom: '0.5rem', fontSize: '0.95rem' }}>💡 نصيحة</h3>
                <p style={{ color: '#4a6fa5', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>
                    أنشئ مقالتك وحفظها كمسودة أولاً، ثم أرسلها للمراجعة عند الانتهاء منها. سيراجعها الفريق وينشرها خلال 24 ساعة.
                </p>
            </div>
        </div>
    );
}

// Client component for the submit-for-review button
function SubmitForReviewButton({ nodeId }: { nodeId: string }) {
    // This needs to be a client action — we'll use a simple API call
    // For now, rendered as a link that triggers the PATCH endpoint via dashboard client action
    return (
        <a
            href={`/api/contributor/submit/${nodeId}`}
            style={{
                fontSize: '0.82rem', color: '#d97706', fontWeight: '600',
                textDecoration: 'none', whiteSpace: 'nowrap',
                padding: '0.25rem 0.625rem', borderRadius: '6px',
                border: '1px solid #fcd34d', background: '#fffbeb',
            }}
        >
            إرسال للمراجعة
        </a>
    );
}

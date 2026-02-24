'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const navItems = [
    { href: '/admin', label: 'لوحة التحكم', icon: '📊' },
    { href: '/admin/content', label: 'إدارة المحتوى', icon: '📝' },
    { href: '/admin/contributors', label: 'المساهمون', icon: '👥' },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside style={{
            width: '240px', background: 'linear-gradient(180deg, #007ec1 0%, #005f94 100%)',
            color: 'white', display: 'flex', flexDirection: 'column',
            padding: '1.5rem 0', minHeight: '100vh', flexShrink: 0,
        }}>
            {/* Brand */}
            <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>📚 سيرلو</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '0.25rem' }}>لوحة الإدارة</div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
                {navItems.map(item => {
                    const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                    return (
                        <Link key={item.href} href={item.href} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '0.25rem',
                            background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                            color: 'white', fontWeight: active ? '700' : '500',
                            textDecoration: 'none', transition: 'background 0.2s', fontSize: '0.95rem',
                        }}>
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User actions */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <Link href="/" style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                    🏠 العودة للموقع
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    style={{
                        background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
                        padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                        fontSize: '0.9rem', fontFamily: 'inherit', width: '100%', textAlign: 'right',
                    }}
                >
                    🚪 تسجيل الخروج
                </button>
            </div>
        </aside>
    );
}

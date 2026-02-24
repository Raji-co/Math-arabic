'use client';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
                background: '#f4f7fa', color: '#555', padding: '0.625rem 1.25rem',
                borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
                border: '1px solid #e2e8f0', cursor: 'pointer', fontFamily: 'inherit',
            }}
        >
            تسجيل الخروج
        </button>
    );
}

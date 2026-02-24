'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        setLoading(false);

        if (res?.error) {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        } else {
            router.push('/admin');
            router.refresh();
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e6f2f9 0%, #ffffff 100%)' }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 8px 32px rgba(0,126,193,0.12)',
                border: '1px solid #eaecf0',
                direction: 'rtl',
            }}>
                {/* Logo / Brand */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #007ec1, #00a8e0)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem', fontSize: '1.8rem',
                    }}>📚</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#007ec1', margin: 0 }}>
                        سيرلو عربي
                    </h1>
                    <p style={{ color: '#666', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                        تسجيل الدخول للوحة التحكم
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontWeight: '600', color: '#333', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                            البريد الإلكتروني
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                            style={{
                                width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
                                border: '1.5px solid #eaecf0', fontSize: '1rem', outline: 'none',
                                direction: 'ltr', textAlign: 'left', transition: 'border-color 0.2s',
                                fontFamily: 'inherit',
                            }}
                            onFocus={e => e.target.style.borderColor = '#007ec1'}
                            onBlur={e => e.target.style.borderColor = '#eaecf0'}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: '600', color: '#333', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                            كلمة المرور
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{
                                width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
                                border: '1.5px solid #eaecf0', fontSize: '1rem', outline: 'none',
                                direction: 'ltr', textAlign: 'left', transition: 'border-color 0.2s',
                                fontFamily: 'inherit',
                            }}
                            onFocus={e => e.target.style.borderColor = '#007ec1'}
                            onBlur={e => e.target.style.borderColor = '#eaecf0'}
                        />
                    </div>

                    {error && (
                        <div style={{
                            background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030',
                            borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem',
                            fontSize: '0.9rem', textAlign: 'center',
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '0.875rem', background: loading ? '#93c5da' : 'linear-gradient(135deg, #007ec1, #0097d6)',
                            color: 'white', border: 'none', borderRadius: '8px',
                            fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s', fontFamily: 'inherit', letterSpacing: '0.01em',
                        }}
                    >
                        {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                    </button>
                </form>
            </div>
        </div>
    );
}

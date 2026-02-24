'use client';

import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import styled from 'styled-components';

const NavHeader = styled.header`
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--serlo-blue);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: var(--foreground);
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: var(--serlo-blue);
  }
`;

const Button = styled(Link)`
  background: var(--serlo-blue);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s, transform 0.1s;

  &:hover {
    background: #006da8;
    color: white;
    transform: translateY(-1px);
  }
`;

export default function Navbar() {
  return (
    <NavHeader>
      <NavContainer>
        <Logo href="/">
          <span>Serlo</span>
          <span style={{ color: 'var(--serlo-green)' }}>بالعربي</span>
        </Logo>
        <NavLinks>
          <NavLink href="/">الرئيسية</NavLink>
          <NavLink href="/topic/topic-math">الرياضيات</NavLink>
          <NavLink href="/editor">أضف محتوى</NavLink>
          <NavAuthButtons />
        </NavLinks>
      </NavContainer>
    </NavHeader>
  );
}

function NavAuthButtons() {
  const [mounted, setMounted] = React.useState(false);
  const [session, setSession] = React.useState<{ user?: { name?: string; role?: string } } | null>(null);

  React.useEffect(() => {
    setMounted(true);
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(data => setSession(data?.user ? data : null));
  }, []);

  if (!mounted) return null;

  if (session?.user) {
    const isAdmin = (session.user as { role?: string }).role === 'admin';
    return (
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Button href={isAdmin ? '/admin' : '/dashboard'}>
          {isAdmin ? '⚙️ لوحة التحكم' : '📋 لوحتي'}
        </Button>
        <a
          href="#"
          style={{ color: '#666', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none' }}
          onClick={async e => {
            e.preventDefault();
            await signOut({ callbackUrl: '/' });
          }}
        >
          خروج
        </a>
      </div>
    );
  }

  return <Button href="/login">تسجيل الدخول</Button>;
}

'use client';

import React from 'react';
import Link from 'next/link';
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
                    <NavLink href="/math">الرياضيات</NavLink>
                    <Button href="/editor">أضف محتوى</Button>
                </NavLinks>
            </NavContainer>
        </NavHeader>
    );
}

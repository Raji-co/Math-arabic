'use client';

import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 3rem 20px;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  color: #666;
`;

export default function Footer() {
    return (
        <FooterContainer>
            <FooterContent>
                <p>نموذج تجريبي لمنصة سيرلو التعليمية باللغة العربية - التركيز على مادة الرياضيات</p>
                <p>© {new Date().getFullYear()} Serlo Education</p>
            </FooterContent>
        </FooterContainer>
    );
}

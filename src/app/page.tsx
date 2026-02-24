'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const HeroSection = styled.section`
  background: linear-gradient(135deg, var(--serlo-light-blue) 0%, #ffffff 100%);
  padding: 6rem 20px;
  text-align: center;
  border-bottom: 1px solid var(--border);
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  color: var(--serlo-blue);
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  color: var(--serlo-dark);
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const PrimaryButton = styled(Link)`
  background: var(--serlo-blue);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: var(--shadow-md);

  &:hover {
    background: #006da8;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const SecondaryButton = styled(Link)`
  background: white;
  color: var(--serlo-blue);
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  border: 2px solid var(--serlo-blue);
  transition: all 0.2s;

  &:hover {
    background: var(--serlo-light-blue);
  }
`;

const TopicsSection = styled.section`
  padding: 5rem 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: var(--serlo-dark);
  margin-bottom: 3rem;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const TopicCard = styled(Link)`
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
    border-color: var(--serlo-blue);
  }
`;

const TopicIcon = styled.div`
  font-size: 3rem;
  color: var(--serlo-blue);
  background: var(--serlo-light-blue);
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const TopicTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--serlo-dark);
  margin-bottom: 0.5rem;
`;

const TopicDescription = styled.p`
  color: #666;
  font-size: 1rem;
`;

export default function Home() {
  return (
    <>
      <HeroSection>
        <div className="container">
          <HeroTitle>الرياضيات للجميع، مجاناً وبدون إعلانات</HeroTitle>
          <HeroSubtitle>
            منصة تعليمية مفتوحة المصدر تهدف إلى توفير محتوى تعليمي عالي الجودة باللغة العربية.
            تعلم الرياضيات خطوة بخطوة مع شروحات تفاعلية وتمارين عملية.
          </HeroSubtitle>
          <ButtonContainer>
            <PrimaryButton href="/topic/topic-math">ابدأ التعلم الآن</PrimaryButton>
            <SecondaryButton href="/editor">ساهم معنا</SecondaryButton>
          </ButtonContainer>
        </div>
      </HeroSection>

      <TopicsSection>
        <SectionTitle>مواضيع الرياضيات</SectionTitle>
        <Grid>
          <TopicCard href="/topic/topic-algebra">
            <TopicIcon>✖️</TopicIcon>
            <TopicTitle>الجبر</TopicTitle>
            <TopicDescription>المعادلات، المتباينات، والدوال</TopicDescription>
          </TopicCard>
          <TopicCard href="/topic/topic-geometry">
            <TopicIcon>📐</TopicIcon>
            <TopicTitle>الهندسة</TopicTitle>
            <TopicDescription>الأشكال الهندسية، المساحات، والأحجام</TopicDescription>
          </TopicCard>
          <TopicCard href="/topic/topic-calculus">
            <TopicIcon>∫</TopicIcon>
            <TopicTitle>التفاضل والتكامل</TopicTitle>
            <TopicDescription>النهايات، المشتقات، والتكاملات</TopicDescription>
          </TopicCard>
          <TopicCard href="/topic/topic-statistics">
            <TopicIcon>📊</TopicIcon>
            <TopicTitle>الإحصاء والاحتمالات</TopicTitle>
            <TopicDescription>تحليل البيانات، المقاييس الإحصائية، ونظرية الاحتمالات</TopicDescription>
          </TopicCard>
        </Grid>
      </TopicsSection>
    </>
  );
}

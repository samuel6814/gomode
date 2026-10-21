import React from 'react';
import styled from 'styled-components';
import { ShoppingBag, HelpCircle, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import { ACCENT_COLOR, PAPER_BG } from '../../../theme/brand';

// --- Styled Components ---

const Section = styled.section`
  width: 100%;
  padding: 6rem 2rem;
  background: ${PAPER_BG};
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1024px) {
    padding: 5rem 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* --- TOP: FEATURES SECTION --- */
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rem;
  width: 100%;
  margin-bottom: 5rem;

  @media (max-width: 1024px) {
    gap: 2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
    margin-bottom: 4rem;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  color: ${ACCENT_COLOR};
  margin-bottom: 0.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
`;

const FeatureText = styled.p`
  font-size: 0.95rem;
  color: #4B5563;
  line-height: 1.5;
  margin: 0;
  max-width: 250px;
`;

/* --- DIVIDER --- */
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #E5E7EB;
  margin-bottom: 5rem;

  @media (max-width: 768px) {
    margin-bottom: 4rem;
  }
`;

/* --- BOTTOM: NEWSLETTER SECTION --- */
const NewsletterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 700px;
`;

const Title = styled.h2`
  font-size: 3.5rem;
  font-weight: 400; /* Lighter weight for that editorial serif look */
  color: #111827;
  margin: 0 0 1.5rem 0;

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #4B5563;
  margin: 0 0 2.5rem 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-bottom: 2rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 1.2rem 1.5rem;
  border-radius: 50px; /* Slight pill shape or adjust to 4px if you want it boxy */
  border: 1px solid #E5E7EB;
  font-size: 0.9rem;
  outline: none;
  color: #111827;
  background: white;
  transition: all 0.2s ease;
  font-family: inherit;

  &::placeholder {
    color: #9CA3AF;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 0.8rem;
  }

  &:focus {
    border-color: #1A1A1A;
    box-shadow: 0 0 0 3px rgba(75, 118, 252, 0.1);
  }
`;

const SubmitButton = styled.button`
  background: #1A1A1A; /* Blue Theme */
  color: white;
  border: none;
  padding: 1.2rem 3rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: #333333;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(75, 118, 252, 0.3);
  }

  @media (max-width: 600px) {
    width: 100%;
    padding: 1.2rem;
  }
`;

const Disclaimer = styled.p`
  font-size: 0.7rem;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  line-height: 1.5;
  max-width: 600px;
`;

const MissionNewsletter = () => {
  const [email, setEmail] = useState('');

  const mutation = useMutation({
    mutationFn: async (emailData) => {
      const res = await apiClient.post('/newsletter/subscribe', { email: emailData });
      return res.data;
    },
    onSuccess: () => {
      setEmail('');
      // We rely on mutation.isSuccess to show the success message
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      mutation.mutate(email);
    }
  };

  return (
    <Section>
      <Container>
        
        {/* TOP: Features Section */}
        <FeaturesGrid>
          <FeatureItem>
            <IconWrapper>
              <ShoppingBag size={28} strokeWidth={1.5} />
            </IconWrapper>
            <FeatureTitle>How to Shop</FeatureTitle>
            <FeatureText>Your guide to shopping and placing orders</FeatureText>
          </FeatureItem>
          
          <FeatureItem>
            <IconWrapper>
              <HelpCircle size={28} strokeWidth={1.5} />
            </IconWrapper>
            <FeatureTitle>FAQS</FeatureTitle>
            <FeatureText>Your questions answered</FeatureText>
          </FeatureItem>
          
          <FeatureItem>
            <IconWrapper>
              <MessageSquare size={28} strokeWidth={1.5} />
            </IconWrapper>
            <FeatureTitle>Need Help?</FeatureTitle>
            <FeatureText>Contact our global Customer Service team</FeatureText>
          </FeatureItem>
        </FeaturesGrid>

        <Divider />

        {/* BOTTOM: Newsletter Section */}
        <NewsletterContainer>
          <Title>Never miss a thing</Title>
          <Subtitle>
            Sign up for promotions, tailored new arrivals, stock updates and more, straight to your inbox
          </Subtitle>
          
          {mutation.isSuccess ? (
            <div style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontWeight: 600 }}>
              <CheckCircle2 size={20} /> Successfully subscribed! Welcome to the club.
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={mutation.isPending}
              />
              <SubmitButton type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Sign Up'}
              </SubmitButton>
            </Form>
          )}

          <Disclaimer>
            By signing up, you consent to receiving marketing by email and/or SMS and acknowledge you have read our Privacy Policy. Unsubscribe anytime at the bottom of our emails or by replying STOP to any of our SMS.
          </Disclaimer>
        </NewsletterContainer>

      </Container>
    </Section>
  );
};

export default MissionNewsletter;
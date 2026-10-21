import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import apiClient from '../../../api/axios';
import {
  BRAND_NAME,
  ACCENT_COLOR,
  SERVICE_NAME,
  SERVICE_SUBJECT,
  CLIENT_TAGLINE,
} from '../../../theme/brand';
import { WHATSAPP_URL } from '../../../utils/contactLinks';

const PageWrapper = styled.div`
  background: #fafafa;
  min-height: 100vh;
  padding-top: 1.5rem;
`;

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
`;

const Hero = styled.section`
  text-align: center;
  margin-bottom: 3.5rem;
`;

const Eyebrow = styled.p`
  color: ${ACCENT_COLOR};
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  color: #111827;
  margin: 0 0 1rem;
`;

const Lead = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #111827;
  margin-bottom: 1.5rem;
`;

const Steps = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1rem;
  counter-reset: step;
`;

const Step = styled.li`
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 1.25rem 1.5rem;
  counter-increment: step;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;

  &::before {
    content: counter(step);
    width: 2rem;
    height: 2rem;
    border-radius: 999px;
    background: ${ACCENT_COLOR};
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
  }

  h3 {
    margin: 0 0 0.35rem;
    font-size: 1.05rem;
  }

  p {
    margin: 0;
    color: #6b7280;
    line-height: 1.5;
  }
`;

const TypesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const TypeCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 1.25rem;

  h3 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
  }

  p {
    margin: 0;
    color: #6b7280;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const FormCard = styled.form`
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 2rem;
  display: grid;
  gap: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.35rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: 2px solid ${ACCENT_COLOR};
    border-color: transparent;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: 2px solid ${ACCENT_COLOR};
    border-color: transparent;
  }
`;

const SubmitBtn = styled.button`
  background: ${ACCENT_COLOR};
  color: #fff;
  border: none;
  padding: 0.9rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  justify-self: start;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Success = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #059669;
  font-size: 0.95rem;
`;

const ErrorText = styled.p`
  color: #dc2626;
  margin: 0;
`;

const WhatsAppLink = styled.a`
  display: inline-block;
  margin-top: 1rem;
  color: ${ACCENT_COLOR};
  font-weight: 600;
`;

const CommissionsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/contact', {
        ...data,
        subject: SERVICE_SUBJECT,
      });
      return res.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <>
      <PageWrapper>
        <Container>
          <Hero>
            <Eyebrow>{BRAND_NAME}</Eyebrow>
            <Title>{SERVICE_NAME}</Title>
            <Lead>
              Tell us what you are looking for. {CLIENT_TAGLINE}
            </Lead>
          </Hero>

          <Section>
            <SectionTitle>How it works</SectionTitle>
            <Steps>
              <Step>
                <div>
                  <h3>Inquire</h3>
                  <p>Share your idea, timeline, and budget using the form below.</p>
                </div>
              </Step>
              <Step>
                <div>
                  <h3>Discuss</h3>
                  <p>We follow up to refine scope, materials, and schedule.</p>
                </div>
              </Step>
              <Step>
                <div>
                  <h3>Create</h3>
                  <p>Production begins once details are confirmed.</p>
                </div>
              </Step>
              <Step>
                <div>
                  <h3>Deliver</h3>
                  <p>Your finished piece ships with care and updates along the way.</p>
                </div>
              </Step>
            </Steps>
          </Section>

          <Section>
            <SectionTitle>Types of work</SectionTitle>
            <TypesGrid>
              <TypeCard>
                <h3>Made to order</h3>
                <p>A piece chosen and finished for you, from the catalog or a brief you send.</p>
              </TypeCard>
              <TypeCard>
                <h3>Gifts</h3>
                <p>Something specific for a person, an event, or a date you already have in mind.</p>
              </TypeCard>
              <TypeCard>
                <h3>Special requests</h3>
                <p>If it is not on the shop yet, send the details and we will say whether we can make it.</p>
              </TypeCard>
            </TypesGrid>
          </Section>

          <Section>
            <SectionTitle>Start an inquiry</SectionTitle>
            <FormCard onSubmit={handleSubmit}>
              {success && (
                <Success>
                  <MessageCircle size={18} /> Inquiry sent. We will reply soon.
                </Success>
              )}
              {mutation.isError && (
                <ErrorText>Failed to send. Please try again.</ErrorText>
              )}

              <div>
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+233 00 000 0000"
                />
              </div>
              <div>
                <Label htmlFor="message">Tell us about your project</Label>
                <TextArea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe what you have in mind..."
                />
              </div>
              <SubmitBtn type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Sending...' : 'Send inquiry'}
              </SubmitBtn>
              <WhatsAppLink
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Or reach out directly on WhatsApp
              </WhatsAppLink>
            </FormCard>
          </Section>

          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            Prefer the shop? <Link to="/shop">Browse ready-to-ship pieces</Link>
          </p>
        </Container>
      </PageWrapper>
    </>
  );
};

export default CommissionsPage;

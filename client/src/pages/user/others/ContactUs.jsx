import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Search, 
  Truck, 
  Sparkles, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Mail, 
  Phone,
  Instagram,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import SEO from '../../../components/SEO';
import {
  CLIENT_EMAIL,
  CLIENT_PHONE,
  INSTAGRAM_HANDLE,
  CANVAS,
  NAVY_ACCENT,
  INK,
  LINE,
  FONT_HERO,
} from '../../../theme/brand';
import { WHATSAPP_URL, INSTAGRAM_URL, PHONE_TEL } from '../../../utils/contactLinks';

const faqData = [
  {
    category: 'Footwear Orders & Ghana Shipping',
    icon: Truck,
    items: [
      {
        question: 'How quickly will my footwear order arrive in Ghana?',
        answer: 'Orders within Greater Accra are delivered within 24 to 48 hours. Regional deliveries (Ashanti, Western, Central, Eastern, Northern) arrive within 2 to 4 business days via our verified courier partners.',
      },
      {
        question: 'How do I track my active order?',
        answer: 'You can track your package directly at /track by entering your order reference number and checkout email address, or through the "My Orders" tab in your client account.',
      },
    ],
  },
  {
    category: 'Sizing & Craftsmanship',
    icon: Sparkles,
    items: [
      {
        question: 'How do GoMode footwear sizes fit?',
        answer: 'Our silhouettes follow standard European sizing (EU 40 to 45). If you are between sizes or have a wider foot profile, we recommend choosing one size up for our loafers and slides.',
      },
      {
        question: 'What materials are used in your footwear?',
        answer: 'We craft our footwear using genuine full-grain leathers, hand-burnished skins, high-density ergonomic EVA footbeds, and reinforced non-slip outsoles.',
      },
    ],
  },
  {
    category: 'Exchanges & Returns',
    icon: RotateCcw,
    items: [
      {
        question: 'What is your exchange policy if a pair does not fit?',
        answer: 'We offer hassle-free size exchanges within 7 days of delivery. Pairs must be unworn, in pristine condition, and in their original packaging box.',
      },
    ],
  },
];

const PageWrapper = styled.div`
  background: ${CANVAS};
  min-height: calc(100vh - 80px);
  padding: 3rem 1.5rem 6rem;
`;

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 3.5rem;

  span {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${NAVY_ACCENT};
    letter-spacing: 0.14em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.5rem;
  }

  h1 {
    font-family: ${FONT_HERO};
    font-size: clamp(2.2rem, 4.5vw, 3.25rem);
    color: ${INK};
    margin: 0 0 1rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 1rem;
    color: #666;
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const AdminDetailsCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  margin-bottom: 4rem;
  text-align: center;
  border: 1px solid ${LINE};

  h2 {
    font-family: ${FONT_HERO};
    font-size: 1.35rem;
    margin: 0 0 2rem 0;
    color: ${INK};
    font-weight: 800;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;

    @media (max-width: 800px) {
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    color: ${NAVY_ACCENT};
    padding: 1rem;
    border-radius: 12px;
    background: #fbfbf9;
    border: 1px solid ${LINE};

    span {
      color: ${INK};
      font-weight: 700;
      font-size: 0.85rem;
    }

    a {
      color: ${INK};
      font-weight: 700;
      font-size: 0.85rem;
      text-decoration: none;
      word-break: break-all;

      &:hover {
        color: ${NAVY_ACCENT};
      }
    }
  }
`;

const FAQSection = styled.div`
  margin-bottom: 4.5rem;
`;

const CategoryHeader = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: ${FONT_HERO};
  font-size: 1.15rem;
  font-weight: 800;
  color: ${INK};
  margin-bottom: 1.25rem;
  margin-top: 2.5rem;

  svg {
    color: ${NAVY_ACCENT};
  }
`;

const AccordionItem = styled.div`
  background: white;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  overflow: hidden;
  border: 1px solid ${LINE};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${NAVY_ACCENT};
  }
`;

const AccordionHeader = styled.div`
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  span {
    font-weight: 700;
    color: ${INK};
    font-size: 0.95rem;
  }
`;

const AccordionContent = styled.div`
  padding: 0 1.5rem 1.25rem 1.5rem;
  color: #555;
  line-height: 1.65;
  font-size: 0.9rem;
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
`;

const ContactCardWrapper = styled.div`
  background: white;
  border: 1px solid ${LINE};
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;

  h2 {
    font-family: ${FONT_HERO};
    font-size: 1.75rem;
    font-weight: 800;
    color: ${INK};
    margin: 0 0 0.5rem;
  }

  p {
    font-size: 0.95rem;
    color: #666;
    margin: 0;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  text-align: left;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${INK};
`;

const Input = styled.input`
  padding: 0.85rem 1rem;
  border: 1px solid ${LINE};
  border-radius: 8px;
  font-size: 0.95rem;
  background: #fbfbf9;
  color: ${INK};
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${NAVY_ACCENT};
    background: #fff;
  }
`;

const TextArea = styled.textarea`
  padding: 0.85rem 1rem;
  border: 1px solid ${LINE};
  border-radius: 8px;
  font-size: 0.95rem;
  background: #fbfbf9;
  color: ${INK};
  min-height: 120px;
  resize: vertical;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${NAVY_ACCENT};
    background: #fff;
  }
`;

const SubmitButton = styled.button`
  background: ${NAVY_ACCENT};
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(37, 60, 90, 0.25);

  &:hover {
    background: #1b2c42;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background: #ecfdf5;
  color: #065f46;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: -0.25rem;
`;

const ContactUs = () => {
  const [openIndex, setOpenIndex] = useState('0-0');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/contact', data);
      return res.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <>
      <SEO
        title="Help & Client Care | GoMode"
        description="Get in touch with GoMode customer support for sizing help, courier delivery updates in Ghana, and bespoke order inquiries."
        url="/contact"
      />

      <PageWrapper>
        <Container>
          <HeroSection>
            <span>CLIENT ASSISTANCE</span>
            <h1>How May We Assist You?</h1>
            <p>
              Whether you need guidance selecting your shoe size, tracking an order across Ghana, or requesting an exchange, our concierge team is at your disposal.
            </p>
          </HeroSection>

          <AdminDetailsCard>
            <h2>Direct Concierge Channels</h2>
            <div className="details-grid">
              <div className="detail-item">
                <Mail size={24} />
                <a href={`mailto:${CLIENT_EMAIL}`}>{CLIENT_EMAIL}</a>
              </div>
              <div className="detail-item">
                <Phone size={24} />
                <a href={PHONE_TEL}>{CLIENT_PHONE}</a>
              </div>
              <div className="detail-item">
                <Instagram size={24} />
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  @{INSTAGRAM_HANDLE}
                </a>
              </div>
              <div className="detail-item">
                <MessageCircle size={24} />
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  WhatsApp Concierge
                </a>
              </div>
            </div>
          </AdminDetailsCard>

          <FAQSection>
            {faqData.map((category, catIdx) => (
              <div key={catIdx}>
                <CategoryHeader>
                  <category.icon size={20} />
                  {category.category}
                </CategoryHeader>

                {category.items.map((item, itemIdx) => {
                  const uniqueId = `${catIdx}-${itemIdx}`;
                  const isOpen = openIndex === uniqueId;

                  return (
                    <AccordionItem key={itemIdx}>
                      <AccordionHeader onClick={() => toggleAccordion(uniqueId)}>
                        <span>{item.question}</span>
                        {isOpen ? <ChevronUp size={18} color={NAVY_ACCENT} /> : <ChevronDown size={18} color="#9CA3AF" />}
                      </AccordionHeader>
                      <AccordionContent $isOpen={isOpen}>{item.answer}</AccordionContent>
                    </AccordionItem>
                  );
                })}
              </div>
            ))}
          </FAQSection>

          <ContactCardWrapper>
            <FormHeader>
              <h2>Send an Inquiry to Client Care</h2>
              <p>Fill out the form below and an advisor will respond within 24 hours.</p>
            </FormHeader>

            <FormContainer onSubmit={handleSubmit}>
              {success && (
                <SuccessMessage>
                  <CheckCircle2 size={18} /> Thank you. Your inquiry has been dispatched to our client care team.
                </SuccessMessage>
              )}

              {mutation.isError && <ErrorMessage>Failed to send inquiry. Please reach out via WhatsApp or email.</ErrorMessage>}

              <FormGroup>
                <Label>Your Name</Label>
                <Input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Kwame Mensah" />
              </FormGroup>

              <FormGroup>
                <Label>Email Address</Label>
                <Input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="kwame@example.com" />
              </FormGroup>

              <FormGroup>
                <Label>Phone Number</Label>
                <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+233 24 123 4567" />
              </FormGroup>

              <FormGroup>
                <Label>Subject</Label>
                <Input required name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. Sizing Advice / Order Query" />
              </FormGroup>

              <FormGroup>
                <Label>Message</Label>
                <TextArea required name="message" value={formData.message} onChange={handleChange} placeholder="Please describe how we can assist you..." />
              </FormGroup>

              <SubmitButton type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Transmitting...' : 'Submit Inquiry'}
              </SubmitButton>
            </FormContainer>
          </ContactCardWrapper>
        </Container>
      </PageWrapper>
    </>
  );
};

export default ContactUs;
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';


const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F8F9FA;
  padding: 2rem;
`;

const AuthCard = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 440px;
  border-radius: 24px;
  padding: 3rem 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6B7280;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  margin-bottom: 2rem;
  transition: color 0.2s;

  &:hover {
    color: #111827;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: #111827;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: serif;
`;

const Subtitle = styled.p`
  color: #6B7280;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #111827;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #FF69B4;
    box-shadow: 0 0 0 4px rgba(255, 105, 180, 0.1);
  }

  &::placeholder {
    color: #9CA3AF;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background-color: #FF69B4;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  box-shadow: 0 4px 14px rgba(255, 105, 180, 0.25);

  &:hover {
    background-color: #f45b9b;
  }

  &:disabled {
    background-color: #FCA5A5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const AlertBox = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  line-height: 1.4;

  ${props => props.type === 'error' && `
    background-color: #FEF2F2;
    color: #991B1B;
    border: 1px solid #FEE2E2;
  `}

  ${props => props.type === 'success' && `
    background-color: #F0FDF4;
    color: #166534;
    border: 1px solid #DCFCE7;
  `}
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Using fetch directly just in case api interceptor isn't available
  const resetMutation = useMutation({
    mutationFn: async (userEmail) => {
      // It assumes the proxy in vite.config.js points /api to backend
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to request password reset');
      }
      return data;
    },
    onSuccess: () => {
      setSubmitted(true);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      resetMutation.mutate(email);
    }
  };

  return (
    <AuthContainer>
      <AuthCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <BackLink to="/login">
          <ArrowLeft size={18} />
          Back to login
        </BackLink>

        <Title>Forgot Password</Title>
        <Subtitle>
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </Subtitle>

        <AnimatePresence mode="wait">
          {resetMutation.isError && (
            <AlertBox
              key="error"
              type="error"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div>{resetMutation.error.message}</div>
            </AlertBox>
          )}

          {submitted && (
            <AlertBox
              key="success"
              type="success"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
              <div>If an account exists for {email}, you will receive a password reset link shortly.</div>
            </AlertBox>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon><Mail size={18} /></InputIcon>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={resetMutation.isPending || submitted}
            />
          </InputGroup>

          <SubmitButton
            type="submit"
            disabled={!email || resetMutation.isPending || submitted}
            whileTap={{ scale: 0.98 }}
          >
            {resetMutation.isPending ? 'Sending Link...' : submitted ? 'Link Sent' : 'Send Reset Link'}
          </SubmitButton>
        </form>
      </AuthCard>
    </AuthContainer>
  );
};

export default ForgotPassword;

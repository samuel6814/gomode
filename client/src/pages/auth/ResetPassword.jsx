import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

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

const ToggleIcon = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;

  &:hover {
    color: #4B5563;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 2.75rem 0.875rem 2.75rem;
  border: 1px solid ${props => props.hasError ? '#EF4444' : '#E5E7EB'};
  border-radius: 12px;
  font-size: 0.95rem;
  color: #111827;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#EF4444' : '#FF69B4'};
    box-shadow: 0 0 0 4px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 105, 180, 0.1)'};
  }

  &::placeholder {
    color: #9CA3AF;
  }
`;

const ErrorText = styled.div`
  color: #EF4444;
  font-size: 0.8rem;
  margin-top: 0.5rem;
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
  margin-top: 1rem;

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

const LinkButton = styled(Link)`
  display: block;
  text-align: center;
  color: #6B7280;
  text-decoration: underline;
  margin-top: 1rem;
  font-size: 0.9rem;

  &:hover {
    color: #111827;
  }
`;

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  // Verify there is a token, otherwise display error immediately
  useEffect(() => {
    if (!token) {
      setValidationError('Invalid or missing password reset token.');
    }
  }, [token]);

  const resetMutation = useMutation({
    mutationFn: async (password) => {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to reset password');
      }
      return data;
    },
    onSuccess: () => {
      // Short delay before redirecting
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successfully. Please log in.' } });
      }, 3000);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!token) {
      setValidationError('Invalid password reset link.');
      return;
    }

    if (newPassword.length < 8) {
      setValidationError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    resetMutation.mutate(newPassword);
  };

  return (
    <AuthContainer>
      <AuthCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Title>Set New Password</Title>
        <Subtitle>
          Your new password must be different from previously used passwords and at least 8 characters long.
        </Subtitle>

        <AnimatePresence mode="wait">
          {(validationError || resetMutation.isError) && (
            <AlertBox
              key="error"
              type="error"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div>{validationError || resetMutation.error?.message}</div>
            </AlertBox>
          )}

          {resetMutation.isSuccess && (
            <AlertBox
              key="success"
              type="success"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
              <div>Password updated successfully! Redirecting to login...</div>
            </AlertBox>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon><Lock size={18} /></InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setValidationError('');
              }}
              required
              disabled={resetMutation.isPending || resetMutation.isSuccess}
              hasError={!!validationError}
            />
            <ToggleIcon type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </ToggleIcon>
          </InputGroup>

          <InputGroup>
            <InputIcon><Lock size={18} /></InputIcon>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setValidationError('');
              }}
              required
              disabled={resetMutation.isPending || resetMutation.isSuccess}
              hasError={!!validationError}
            />
            <ToggleIcon type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </ToggleIcon>
          </InputGroup>

          <SubmitButton
            type="submit"
            disabled={!newPassword || !confirmPassword || resetMutation.isPending || resetMutation.isSuccess}
            whileTap={{ scale: 0.98 }}
          >
            {resetMutation.isPending ? 'Updating...' : 'Reset Password'}
          </SubmitButton>
        </form>

        {!token && (
          <LinkButton to="/forgot-password">
            Request a new reset link
          </LinkButton>
        )}
      </AuthCard>
    </AuthContainer>
  );
};

export default ResetPassword;

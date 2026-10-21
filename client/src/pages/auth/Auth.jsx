import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { gsap } from '../../utils/gsap';
import { signIn, signUp } from '../../api/authClient';
import BuyyLogo from '../../components/BuyyLogo';
import {
  BRAND_NAME,
  CLIENT_CITY,
  CLIENT_TAGLINE,
  HERO_EYEBROW,
  ACCENT_COLOR,
  PAPER_BG,
  PAPER_DARK,
  GRAPHITE_DARK,
  GRAPHITE_MID,
  GRAPHITE_LIGHT,
  FONT_FAMILY,
  ART_CORAL,
  ART_SAGE,
  ART_LAVENDER,
} from '../../theme/brand';
import { media } from '../../theme/breakpoints';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${PAPER_BG};
  font-family: ${FONT_FAMILY};
  color: ${GRAPHITE_DARK};
  padding: 2rem 1rem;
`;

const PaperTexture = styled.div`
  position: fixed;
  inset: 0;
  opacity: 0.04;
  pointer-events: none;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  z-index: 0;
`;

const VisualPanel = styled.aside`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 220px;
  overflow: hidden;

  @media ${media.desktop} {
    min-height: 100vh;
    position: sticky;
    top: 0;
    height: 100vh;
  }
`;

const VisualImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url('/about-image.jpg');
  background-size: cover;
  background-position: center 20%;
  filter: grayscale(20%);
`;

const VisualOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(244, 241, 235, 0.15) 0%,
    rgba(26, 26, 26, 0.55) 55%,
    rgba(26, 26, 26, 0.82) 100%
  );
`;

const ArtGlow = styled.div`
  position: absolute;
  inset: 15% 10%;
  background: radial-gradient(
    circle at 30% 40%,
    ${ART_CORAL}33 0%,
    ${ART_SAGE}22 40%,
    ${ART_LAVENDER}15 60%,
    transparent 75%
  );
  filter: blur(40px);
  pointer-events: none;
`;

const VisualContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem 1.5rem 2.5rem;
  color: ${PAPER_BG};

  @media ${media.tabletUp} {
    padding: 3rem 2.5rem;
  }

  @media ${media.desktop} {
    padding: 3.5rem;
  }
`;

const Eyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.85;
`;

const VisualTitle = styled.h1`
  margin: 0 0 1rem;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  max-width: 16rem;

  em {
    display: block;
    font-style: italic;
    font-weight: 500;
    font-size: 0.55em;
    opacity: 0.75;
    margin-top: 0.2em;
  }
`;

const VisualQuote = styled.p`
  margin: 0 0 1.25rem;
  font-size: 0.95rem;
  line-height: 1.65;
  opacity: 0.88;
  max-width: 22rem;
`;

const VisualMeta = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.7;
`;

const FormPanel = styled.main`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 460px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;

  @media ${media.desktop} {
    margin-bottom: 3rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${GRAPHITE_MID};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: ${GRAPHITE_DARK};
  }
`;

const BrandLink = styled(Link)`
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${GRAPHITE_DARK};
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const FormCard = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 28px;
  padding: 2rem 1.5rem;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1);
`;

const FormIntro = styled.div`
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 4vw, 1.875rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${GRAPHITE_DARK};
`;

const FormSubtitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${GRAPHITE_MID};
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid ${PAPER_DARK};
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const TabButton = styled.button`
  flex: 1;
  border: none;
  background: ${(props) => (props.$active ? '#fff' : 'transparent')};
  color: ${(props) => (props.$active ? GRAPHITE_DARK : GRAPHITE_MID)};
  padding: 0.65rem 1rem;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${(props) => (props.$active ? '0 1px 4px rgba(0,0,0,0.06)' : 'none')};
  transition: all 0.2s;

  &:hover {
    color: ${GRAPHITE_DARK};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;

  label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: ${GRAPHITE_MID};
    margin-bottom: 0.45rem;
  }

  input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid ${(props) => (props.$hasError ? '#ef4444' : PAPER_DARK)};
    background: #fff;
    border-radius: 6px;
    padding: 0.8rem 0.9rem;
    color: ${GRAPHITE_DARK};
    font-family: inherit;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;

    &::placeholder {
      color: ${GRAPHITE_LIGHT};
    }

    &:focus {
      border-color: ${(props) => (props.$hasError ? '#ef4444' : ACCENT_COLOR)};
      box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
    }
  }

  .error-text {
    display: block;
    margin-top: 0.4rem;
    color: #dc2626;
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.25rem 0 1.5rem;
  gap: 1rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 500;
    color: ${GRAPHITE_MID};

    input {
      width: 15px;
      height: 15px;
      accent-color: ${ACCENT_COLOR};
      margin: 0;
    }
  }

  button.forgot {
    background: transparent;
    border: none;
    color: ${GRAPHITE_DARK};
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    white-space: nowrap;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const PrimaryBtn = styled.button`
  width: 100%;
  background: ${(props) => (props.disabled ? GRAPHITE_LIGHT : ACCENT_COLOR)};
  color: #fff;
  border: none;
  padding: 0.9rem 1.25rem;
  border-radius: 9999px;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: opacity 0.2s;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    opacity: 0.88;
  }

  svg.spin {
    animation: ${spin} 1s linear infinite;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${PAPER_DARK};
  }

  span {
    padding: 0 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: ${GRAPHITE_LIGHT};
  }
`;

const GoogleBtn = styled.button`
  width: 100%;
  background: #fff;
  color: ${GRAPHITE_DARK};
  border: 1px solid ${PAPER_DARK};
  padding: 0.9rem 1.25rem;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  transition: border-color 0.2s, background 0.2s;

  &:hover:not(:disabled) {
    border-color: ${GRAPHITE_MID};
    background: rgba(255, 255, 255, 0.8);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg.spin {
    animation: ${spin} 1s linear infinite;
  }
`;

const ErrorBanner = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.85rem 1rem;
  border-radius: 6px;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
`;

const FooterText = styled.p`
  margin: 2.5rem auto 0;
  max-width: 420px;
  width: 100%;
  font-size: 0.75rem;
  color: ${GRAPHITE_LIGHT};
  line-height: 1.7;
  text-align: center;

  a {
    color: ${GRAPHITE_MID};
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
  });

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.auth-form > *',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, delay: 0.15, ease: 'power3.out' }
      );
    }, page);

    return () => ctx.revert();
  }, []);

  const handleTabSwitch = (loginState) => {
    setIsLogin(loginState);
    setServerError(null);
    reset();
  };

  const onSubmit = async (formData) => {
    setServerError(null);

    try {
      if (isLogin) {
        const { data, error } = await signIn.email({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw new Error(error.message || 'Login failed.');

        const userRole = data?.user?.role?.toUpperCase();

        if (userRole === 'ADMIN') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/';
        }
      } else {
        const { error } = await signUp.email({
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
        });

        if (error) throw new Error(error.message || 'Sign up failed.');

        window.location.href = '/';
      }
    } catch (err) {
      setServerError(err.message || 'Authentication failed.');
    }
  };

  const handleGoogleSignIn = async () => {
    setServerError(null);
    setIsGoogleLoading(true);

    try {
      const { error } = await signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/auth/callback`,
      });

      if (error) throw new Error(error.message || 'Google sign-in failed.');
    } catch (err) {
      setServerError(err.message || 'Authentication with Google failed. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <PageWrapper ref={pageRef}>
      <FormPanel>
        <TopBar>
          <BackLink to="/">
            <ArrowLeft size={16} />
            Back to shop
          </BackLink>
          <Link to="/" aria-label="buyy"><BuyyLogo size={28} /></Link>
        </TopBar>

        <FormCard className="auth-form">
          <FormIntro>
            <FormTitle>{isLogin ? 'Welcome back' : 'Create your account'}</FormTitle>
            <FormSubtitle>
              {isLogin
                ? 'Sign in to track orders and pick up where you left off.'
                : 'Join to save favourites and checkout faster.'}
            </FormSubtitle>
          </FormIntro>

          <Tabs>
            <TabButton type="button" $active={isLogin} onClick={() => handleTabSwitch(true)}>
              Sign in
            </TabButton>
            <TabButton type="button" $active={!isLogin} onClick={() => handleTabSwitch(false)}>
              Create account
            </TabButton>
          </Tabs>

          {serverError && <ErrorBanner>{serverError}</ErrorBanner>}

          <form onSubmit={handleSubmit(onSubmit)}>
            {!isLogin && (
              <FormGroup $hasError={!!errors.fullName}>
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  {...register('fullName')}
                />
                {errors.fullName && <span className="error-text">{errors.fullName.message}</span>}
              </FormGroup>
            )}

            <FormGroup $hasError={!!errors.email}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && <span className="error-text">{errors.email.message}</span>}
            </FormGroup>

            <FormGroup $hasError={!!errors.password}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                {...register('password')}
              />
              {errors.password && <span className="error-text">{errors.password.message}</span>}
            </FormGroup>

            <FormActions>
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              {isLogin && (
                <button type="button" className="forgot" onClick={() => navigate('/forgot-password')}>
                  Forgot password?
                </button>
              )}
            </FormActions>

            <PrimaryBtn type="submit" disabled={isSubmitting || isGoogleLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin" />
                  {isLogin ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (
                isLogin ? 'Sign in' : 'Create account'
              )}
            </PrimaryBtn>
          </form>

          <Divider>
            <span>or</span>
          </Divider>

          <GoogleBtn type="button" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isSubmitting}>
            {isGoogleLoading ? (
              <Loader2 size={18} className="spin" />
            ) : (
              <FcGoogle size={18} />
            )}
            Continue with Google
          </GoogleBtn>
        </FormCard>

        <FooterText>
          By continuing, you agree to our{' '}
          <Link to="/terms">Terms</Link> and{' '}
          <Link to="/privacy">Privacy Policy</Link>.
          <br />
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </FooterText>
      </FormPanel>
    </PageWrapper>
  );
};

export default Auth;

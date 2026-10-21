import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap, ScrollTrigger } from '../utils/gsap';

const RevealWrap = styled.div`
  &.scroll-reveal-reduced {
    opacity: 1 !important;
    transform: none !important;
  }
`;

export function refreshScrollTriggers() {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

const ScrollReveal = ({
  children,
  className,
  delay = 0,
  y = 40,
  stagger = 0,
  as: Tag = 'div',
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('scroll-reveal-reduced');
      return undefined;
    }

    const targets = stagger > 0 ? el.children : el;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          stagger: stagger || 0,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, y, stagger]);

  return (
    <RevealWrap as={Tag} ref={ref} className={`scroll-reveal ${className || ''}`}>
      {children}
    </RevealWrap>
  );
};

export default ScrollReveal;

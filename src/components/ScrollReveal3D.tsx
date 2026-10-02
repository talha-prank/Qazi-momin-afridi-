import React, { useEffect, useRef, useState } from 'react';

export interface ScrollReveal3DProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds
  depth?: number; // Z-axis translate distance (e.g. -90px to -140px)
  rotateX?: number; // Initial tilt angle in degrees around X axis
  rotateY?: number; // Initial tilt angle in degrees around Y axis
  translateY?: number; // Initial translate Y in px
  scale?: number; // Initial scale (e.g. 0.95)
  threshold?: number; // Intersection threshold
  rootMargin?: string;
  perspective?: number; // 3D perspective in px
  style?: React.CSSProperties;
}

export const ScrollReveal3D: React.FC<ScrollReveal3DProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 900,
  depth = -90,
  rotateX = 6,
  rotateY = 0,
  translateY = 40,
  scale = 0.96,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  perspective = 1400,
  style: userStyle = {}
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect accessibility settings
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const currentEl = elementRef.current;
    if (!currentEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once revealed, unobserve to free resources and preserve interactiveness
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(currentEl);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const computedStyle: React.CSSProperties = {
    perspective: `${perspective}px`,
    transformStyle: 'preserve-3d',
    transform: isVisible
      ? 'perspective(1400px) translate3d(0, 0, 0px) rotateX(0deg) rotateY(0deg) scale(1)'
      : `perspective(1400px) translate3d(0, ${translateY}px, ${depth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
    opacity: isVisible ? 1 : 0,
    filter: isVisible ? 'blur(0px)' : 'blur(4px)',
    transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms ease-out ${delay}ms`,
    willChange: 'transform, opacity, filter',
    ...userStyle
  };

  return (
    <div ref={elementRef} style={computedStyle} className={className}>
      {children}
    </div>
  );
};

/**
 * Section-level 3D Reveal Container
 * Employs Intersection Observer to trigger a majestic 3D Z-axis entrance
 * as each main section scrolls into the viewport.
 */
export const SectionReveal3D: React.FC<{
  children: React.ReactNode;
  id?: string;
  className?: string;
  depth?: number;
  rotateX?: number;
  delay?: number;
}> = ({ children, id, className = '', depth = -110, rotateX = 5, delay = 0 }) => {
  return (
    <ScrollReveal3D
      depth={depth}
      rotateX={rotateX}
      delay={delay}
      duration={1000}
      threshold={0.06}
      rootMargin="0px 0px -60px 0px"
      className={`w-full ${className}`}
    >
      {id ? <div id={id}>{children}</div> : children}
    </ScrollReveal3D>
  );
};

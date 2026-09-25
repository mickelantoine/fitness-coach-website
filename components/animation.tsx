'use client';

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { useRef, ReactNode, useEffect, useState } from 'react';

/* ---------- Scroll-based parallax ---------- */

export function Parallax({
  children,
  offset = 50,
  className = '',
}: {
  children: ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: reduceMotion ? 0 : y }}>{children}</motion.div>
    </div>
  );
}

/* Parallax with independent X + Y drift for layered depth */
export function ParallaxLayer({
  children,
  yOff = 50,
  xOff = 0,
  scale = 1,
  className = '',
}: {
  children: ReactNode;
  yOff?: number;
  xOff?: number;
  scale?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [yOff, -yOff]);
  const x = useTransform(scrollYProgress, [0, 1], [-xOff, xOff]);
  const s = useTransform(scrollYProgress, [0, 0.5, 1], [scale * 0.95, scale, scale * 0.95]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: reduceMotion ? 0 : y, x: reduceMotion ? 0 : x, scale: reduceMotion ? 1 : s }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ---------- Scroll-triggered reveals ---------- */

export function FadeIn({
  children,
  delay = 0,
  y = 30,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Text reveal with clip-path mask wipe */
export function TextReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: reduceMotion ? 0 : '100%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* Image reveal — scales in with a clip wipe from bottom */
export function ImageReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={reduceMotion ? {} : { clipPath: 'inset(100% 0 0 0)' }}
        whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full"
      >
        <motion.div
          initial={reduceMotion ? {} : { scale: 1.15 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function StaggerContainer({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.1, delayChildren: delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Mouse tracking ---------- */

/* Global cursor spotlight — a soft glow that follows the mouse.
   Place once near the root of a page. */
export function CursorSpotlight({
  color = 'hsl(40 35% 55%)',
  size = 500,
  opacity = 0.06,
}: {
  color?: string;
  size?: number;
  opacity?: number;
}) {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    if (reduceMotion) return;
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX - size / 2);
      mouseY.set(e.clientY - size / 2);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [mouseX, mouseY, size, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-[5] rounded-full"
      style={{
        x: smoothX,
        y: smoothY,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
      }}
    />
  );
}

/* Tilt card — tilts toward the mouse position on hover.
   Wraps any content; adds perspective + springy rotation. */
export function TiltCard({
  children,
  className = '',
  maxTilt = 8,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { damping: 20, stiffness: 300 });
  const rotateY = useSpring(useMotionValue(0), { damping: 20, stiffness: 300 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - py) * maxTilt * 2);
    rotateY.set((px - 0.5) * maxTilt * 2);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Mouse-reactive parallax — content shifts slightly based on
   mouse position relative to viewport center. Good for hero images. */
export function MouseParallax({
  children,
  strength = 20,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), { damping: 40, stiffness: 150 });
  const y = useSpring(useMotionValue(0), { damping: 40, stiffness: 150 });

  useEffect(() => {
    if (reduceMotion) return;
    const handler = (e: MouseEvent) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      x.set(cx * strength);
      y.set(cy * strength);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [x, y, strength, reduceMotion]);

  return (
    <motion.div style={{ x: reduceMotion ? 0 : x, y: reduceMotion ? 0 : y }} className={className}>
      {children}
    </motion.div>
  );
}

/* Magnetic button — content drifts toward the cursor on hover */
export function MagneticButton({
  children,
  strength = 0.3,
  className = '',
  href,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
  href: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), { damping: 15, stiffness: 200 });
  const y = useSpring(useMotionValue(0), { damping: 15, stiffness: 200 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(mx * strength);
    y.set(my * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/* Scroll progress bar — thin accent line at top of viewport */
export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { damping: 30, stiffness: 200 });

  if (reduceMotion) return null;

  return (
    <motion.div
      className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}

/* Hook: useInView — returns true when element enters viewport */
export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

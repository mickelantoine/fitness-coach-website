'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import type { Transformation } from '@/lib/types';

export function TransformationCard({ transformation }: { transformation: Transformation }) {
  const [showBefore, setShowBefore] = useState(false);
  const hasImages = transformation.before_image_url && transformation.after_image_url;
  const reduceMotion = useReducedMotion();

  // Mouse tilt
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { damping: 20, stiffness: 300 });
  const rotateY = useSpring(useMotionValue(0), { damping: 20, stiffness: 300 });

  // Mouse glow position
  const glowX = useSpring(useMotionValue(-200), { damping: 30, stiffness: 200 });
  const glowY = useSpring(useMotionValue(-200), { damping: 30, stiffness: 200 });
  const glowOpacity = useTransform(glowX, [-200, 0, 200], [0, 0.15, 0]);

  const handleMove = (e: React.MouseEvent) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - py) * 10);
    rotateY.set((px - 0.5) * 10);
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(-200);
    glowY.set(-200);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setShowBefore(true)}
      onMouseLeave={() => {
        setShowBefore(false);
        handleLeave();
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-card cursor-pointer"
      onClick={() => hasImages && setShowBefore(!showBefore)}
    >
      {/* After image */}
      {transformation.after_image_url ? (
        <Image
          src={transformation.after_image_url}
          alt={`${transformation.client_name} after`}
          fill
          className="object-cover transition-all duration-700"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary to-card">
          <span className="font-serif text-6xl text-accent/20">
            {transformation.client_name.charAt(0)}
          </span>
        </div>
      )}

      {/* Before image with smooth crossfade */}
      {hasImages && (
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: showBefore ? 1 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={transformation.before_image_url!}
            alt={`${transformation.client_name} before`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </motion.div>
      )}

      {/* Mouse-following glow */}
      <motion.div
        className="pointer-events-none absolute h-32 w-32 rounded-full bg-accent blur-40"
        style={{
          x: glowX,
          y: glowY,
          opacity: glowOpacity,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

      {/* Info overlay — slides up on hover */}
      <motion.div
        className="absolute inset-x-0 bottom-0 p-6"
        initial={false}
        animate={showBefore ? { y: 0 } : { y: 0 }}
      >
        <div className="mb-2 flex items-center gap-2">
          {transformation.transformation_categories && (
            <span className="rounded-sm bg-accent/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
              {transformation.transformation_categories.name}
            </span>
          )}
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {transformation.duration}
          </span>
        </div>
        <h3 className="font-serif text-xl font-bold text-foreground">
          {transformation.client_name}
        </h3>
        {transformation.goal && (
          <p className="mt-1 text-sm text-muted-foreground">{transformation.goal}</p>
        )}
        {hasImages && (
          <motion.p
            className="mt-2 text-xs text-accent/70"
            initial={false}
            animate={{ opacity: showBefore ? 1 : 0.7 }}
          >
            {showBefore ? 'Showing: Before' : 'Hover to see before'}
          </motion.p>
        )}
        {transformation.testimonial && (
          <motion.p
            className="mt-2 text-xs italic text-muted-foreground line-clamp-2"
            initial={false}
            animate={{
              opacity: showBefore ? 1 : 0,
              height: showBefore ? 'auto' : 0,
            }}
            transition={{ duration: 0.4 }}
          >
            &ldquo;{transformation.testimonial}&rdquo;
          </motion.p>
        )}
      </motion.div>

      {/* Before/After label badge */}
      {hasImages && (
        <motion.div
          className="absolute top-4 right-4 rounded-sm bg-background/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm"
          initial={false}
          animate={{
            backgroundColor: showBefore ? 'rgba(220,38,38,0.8)' : 'rgba(10,10,10,0.8)',
            color: '#fff',
          }}
          transition={{ duration: 0.3 }}
        >
          {showBefore ? 'Before' : 'After'}
        </motion.div>
      )}
    </motion.div>
  );
}

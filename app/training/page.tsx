'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Dumbbell, ChevronRight } from 'lucide-react';
import { PageWrapper } from '@/components/page-wrapper';
import { FadeIn, TextReveal, MouseParallax } from '@/components/animation';
import { getMuscleGroups, getExercisesByMuscleGroup } from '@/lib/data';
import type { MuscleGroup, Exercise } from '@/lib/types';

export default function TrainingPage() {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);

  useEffect(() => {
    getMuscleGroups().then((groups) => {
      setMuscleGroups(groups);
      if (groups.length > 0) {
        setSelectedMuscle(groups[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedMuscle) return;
    setLoadingExercises(true);
    getExercisesByMuscleGroup(selectedMuscle.id).then((ex) => {
      setExercises(ex);
      setLoadingExercises(false);
    });
  }, [selectedMuscle]);

  return (
    <PageWrapper>
      <section className="relative flex min-h-[50vh] items-end overflow-hidden pt-24">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-card to-background" />
        <div className="relative z-10 container-wide pb-12">
          <TextReveal>
            <p className="eyebrow mb-4">Interactive Training Library</p>
          </TextReveal>
          <div className="overflow-hidden">
            <motion.h1
              className="text-display font-serif text-balance"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Training Videos
            </motion.h1>
          </div>
          <FadeIn delay={0.3}>
            <p className="mt-4 max-w-xl text-subheading">
              Click on any muscle group to explore targeted exercises, techniques, and training videos.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <div className="rounded-sm border border-border bg-card/50 p-6">
              <h2 className="mb-6 font-serif text-lg font-bold">Select Muscle Group</h2>
              <MouseParallax strength={8} className="mb-4">
                <BodyDiagram
                  muscleGroups={muscleGroups}
                  selectedSlug={selectedMuscle?.slug}
                  onSelect={setSelectedMuscle}
                />
              </MouseParallax>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {muscleGroups.map((mg) => (
                  <button
                    key={mg.id}
                    onClick={() => setSelectedMuscle(mg)}
                    className={`rounded-sm border px-3 py-2 text-xs font-medium transition-all ${
                      selectedMuscle?.id === mg.id
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border text-muted-foreground hover:border-accent/40 hover:text-foreground'
                    }`}
                  >
                    {mg.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMuscle?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-heading font-serif">
                    {selectedMuscle?.name || 'Select a muscle group'}
                  </h2>
                  {selectedMuscle?.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{selectedMuscle.description}</p>
                  )}
                </div>

                {loadingExercises ? (
                  <div className="py-20 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  </div>
                ) : exercises.length === 0 ? (
                  <div className="py-20 text-center">
                    <Dumbbell size={32} className="mx-auto text-accent/30" />
                    <p className="mt-4 text-muted-foreground">
                      No exercises yet for this muscle group.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {exercises.map((ex, i) => (
                      <ExerciseCard key={ex.id} exercise={ex} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group overflow-hidden rounded-sm border border-border bg-card/50 transition-all duration-300 hover:border-accent/40"
    >
      <div
        className="relative aspect-video cursor-pointer bg-secondary"
        onClick={() => setShowVideo(!showVideo)}
      >
        {exercise.thumbnail_url ? (
          <Image
            src={exercise.thumbnail_url}
            alt={exercise.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Dumbbell size={32} className="text-accent/20" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent bg-background/60">
            <Play size={18} className="ml-0.5 text-accent" />
          </div>
        </div>
        {exercise.featured && (
          <span className="absolute top-3 right-3 rounded-sm bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
            Featured
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground">{exercise.name}</h3>
        {exercise.description && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {exercise.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-sm bg-secondary px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {exercise.difficulty}
          </span>
          {exercise.equipment && (
            <span className="rounded-sm bg-secondary px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {exercise.equipment}
            </span>
          )}
        </div>
        {showVideo && exercise.video_url && (
          <div className="mt-3">
            <video controls className="w-full rounded-sm" src={exercise.video_url} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function BodyDiagram({
  muscleGroups,
  selectedSlug,
  onSelect,
}: {
  muscleGroups: MuscleGroup[];
  selectedSlug?: string;
  onSelect: (mg: MuscleGroup) => void;
}) {
  const musclePositions: Record<string, { x: number; y: number; w: number; h: number }> = {
    shoulders: { x: 85, y: 55, w: 50, h: 25 },
    chest: { x: 92, y: 82, w: 36, h: 35 },
    biceps: { x: 55, y: 88, w: 22, h: 38 },
    triceps: { x: 143, y: 88, w: 22, h: 38 },
    forearms: { x: 45, y: 130, w: 20, h: 40 },
    forearms2: { x: 155, y: 130, w: 20, h: 40 },
    abs: { x: 95, y: 120, w: 30, h: 45 },
    obliques: { x: 80, y: 125, w: 12, h: 35 },
    obliques2: { x: 128, y: 125, w: 12, h: 35 },
    back: { x: 92, y: 82, w: 36, h: 55 },
    glutes: { x: 88, y: 168, w: 44, h: 30 },
    quadriceps: { x: 82, y: 200, w: 24, h: 55 },
    quadriceps2: { x: 114, y: 200, w: 24, h: 55 },
    hamstrings: { x: 82, y: 200, w: 24, h: 55 },
    hamstrings2: { x: 114, y: 200, w: 24, h: 55 },
    calves: { x: 84, y: 258, w: 20, h: 45 },
    calves2: { x: 116, y: 258, w: 20, h: 45 },
  };

  return (
    <div className="relative mx-auto" style={{ maxWidth: '240px' }}>
      <svg viewBox="0 0 240 320" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body silhouette */}
        <path
          d="M120 20 C 132 20, 140 28, 140 40 C 140 48, 136 54, 130 56 L 130 60 C 150 64, 165 75, 170 90 L 175 120 L 175 160 L 170 180 L 165 200 L 160 220 L 155 260 L 150 300 L 140 305 L 130 300 L 128 260 L 125 220 L 120 200 L 115 220 L 112 260 L 110 300 L 100 305 L 90 300 L 85 260 L 80 220 L 75 200 L 70 180 L 65 160 L 65 120 L 70 90 C 75 75, 90 64, 110 60 L 110 56 C 104 54, 100 48, 100 40 C 100 28, 108 20, 120 20 Z"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          className="transition-all"
        />

        {/* Head */}
        <circle cx="120" cy="35" r="18" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="1" />

        {/* Muscle group overlays */}
        {muscleGroups.map((mg) => {
          const pos = musclePositions[mg.slug];
          if (!pos) return null;
          const isSelected = selectedSlug === mg.slug;
          return (
            <g key={mg.id}>
              {/* Left side or center */}
              <ellipse
                cx={pos.x + pos.w / 2}
                cy={pos.y + pos.h / 2}
                rx={pos.w / 2}
                ry={pos.h / 2}
                fill={isSelected ? 'hsl(var(--accent))' : 'hsl(var(--accent) / 0.15)'}
                stroke={isSelected ? 'hsl(var(--accent))' : 'hsl(var(--accent) / 0.3)'}
                strokeWidth="1.5"
                className="cursor-pointer transition-all duration-300 hover:fill-hsl(var(--accent) / 0.4)"
                onClick={() => onSelect(mg)}
              />
              {/* Right side for paired muscles */}
              {['biceps', 'triceps', 'forearms', 'obliques', 'quadriceps', 'hamstrings', 'calves'].includes(mg.slug) && (
                <ellipse
                  cx={240 - pos.x - pos.w / 2}
                  cy={pos.y + pos.h / 2}
                  rx={pos.w / 2}
                  ry={pos.h / 2}
                  fill={isSelected ? 'hsl(var(--accent))' : 'hsl(var(--accent) / 0.15)'}
                  stroke={isSelected ? 'hsl(var(--accent))' : 'hsl(var(--accent) / 0.3)'}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all duration-300 hover:fill-hsl(var(--accent) / 0.4)"
                  onClick={() => onSelect(mg)}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { StudioNav } from "@/components/studio/studio-nav";
import { Phase1Profile } from "@/components/studio/phase1-profile";
import { Phase2Moments, type ActiveMoment } from "@/components/studio/phase2-moments";
import { Phase3Results } from "@/components/studio/phase3-results";
import { useMusicSuggestions } from "@/hooks/useMusicSuggestions";
import type { Phase1Data, MomentConfig } from "@/components/studio/types";

type Phase = 1 | 2 | 3;

export default function StudioPage() {
  const [phase, setPhase] = useState<Phase>(1);
  const [profileData, setProfileData] = useState<Phase1Data | null>(null);
  const [, setMomentsData] = useState<Record<string, MomentConfig> | null>(null);
  const { suggest, status, results, error } = useMusicSuggestions();

  const handlePhase2Next = (moments: Record<string, MomentConfig>, activeList: ActiveMoment[]) => {
    setMomentsData(moments);
    // Dispara a IA enquanto a transição acontece; a Fase 3 mostra o loading.
    suggest(profileData, activeList);
    setPhase(3);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <StudioNav phase={phase} />
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {phase === 1 && (
            <Phase1Profile
              onNext={(data) => { setProfileData(data); setPhase(2); window.scrollTo(0, 0); }}
            />
          )}
          {phase === 2 && (
            <Phase2Moments
              onNext={handlePhase2Next}
              onBack={() => { setPhase(1); window.scrollTo(0, 0); }}
            />
          )}
          {phase === 3 && (
            <Phase3Results
              profile={profileData}
              aiStatus={status}
              aiResults={results}
              aiError={error}
              onBack={() => { setPhase(2); window.scrollTo(0, 0); }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

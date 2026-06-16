"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { StudioNav } from "@/components/studio/studio-nav";
import { Phase1Profile } from "@/components/studio/phase1-profile";
import { Phase2Moments } from "@/components/studio/phase2-moments";
import { Phase3Results } from "@/components/studio/phase3-results";
import type { Phase1Data, MomentConfig } from "@/components/studio/types";

type Phase = 1 | 2 | 3;

export default function StudioPage() {
  const [phase, setPhase] = useState<Phase>(1);
  const [profileData, setProfileData] = useState<Phase1Data | null>(null);
  const [momentsData, setMomentsData] = useState<Record<string, MomentConfig> | null>(null);

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
              onNext={(data) => { setMomentsData(data); setPhase(3); window.scrollTo(0, 0); }}
              onBack={() => { setPhase(1); window.scrollTo(0, 0); }}
            />
          )}
          {phase === 3 && profileData && momentsData && (
            <Phase3Results
              profile={profileData}
              moments={momentsData}
              onBack={() => { setPhase(2); window.scrollTo(0, 0); }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

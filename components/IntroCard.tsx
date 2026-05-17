"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AVATAR_SRC =
  "https://www.figma.com/api/mcp/asset/a16704cc-0eb1-48c8-a3f8-fcf9a1871692";
const DOT_SRC =
  "https://www.figma.com/api/mcp/asset/8a736520-bcb6-4436-901b-b7d82b7d9168";

const BIO =
  "I'm a multidisciplinary Product Designer and aspiring Design Engineer with over 4 years of experience designing digital products across Fintech, SaaS, EdTech, Mobility, Wellness, and Event industries. He currently works as a Lead UI/UX Designer, where he leads design projects, collaborates with cross-functional teams, mentors designers, and transforms complex ideas into intuitive and visually compelling user experiences.";

// Lively spring for expanding
const EXPAND_SPRING = { type: "spring" as const, stiffness: 241, damping: 17.9, mass: 1 };
// Smooth ease-in-out for collapsing — no bounce, feels natural
const COLLAPSE_EASE = { type: "tween" as const, ease: [0.42, 0, 0.58, 1] as const, duration: 0.34 };

const TILT_SPRING = { stiffness: 320, damping: 26, mass: 0.6 };

const SHADOW_TRANSITION = { duration: 0.4, ease: "easeOut" as const };

export default function IntroCard() {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  /* ── Responsive widths ── */
  const [dims, setDims] = useState({ collapsed: 317, expanded: 537 });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const pad = 32; // 16px each side
      setDims({
        collapsed: Math.min(317, vw - pad),
        expanded:  Math.min(537, vw - pad),
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ── 3D tilt (expanded only) ── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), TILT_SPRING);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), TILT_SPRING);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!expanded) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  }

  function resetTilt() { mx.set(0); my.set(0); }

  /* ── Shine sweep on press (expanded only) ── */
  const shineX = useMotionValue("-160%");

  function handlePointerDown() {
    if (!expanded) return;
    shineX.set("-160%");
    animate(shineX, "160%", { duration: 0.55, ease: [0.22, 1, 0.36, 1] });
  }

  function handleToggle() {
    resetTilt();
    setExpanded((v) => !v);
  }

  const morphTransition = expanded ? EXPAND_SPRING : COLLAPSE_EASE;

  return (
    <div style={{ perspective: "900px" }}>
      <motion.div
        ref={cardRef}
        onClick={handleToggle}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        onPointerDown={handlePointerDown}
        animate={{
          width:        expanded ? dims.expanded : dims.collapsed,
          borderRadius: expanded ? 8 : 31,
          boxShadow:    expanded
            ? "0 12px 48px rgba(255, 255, 255, 0.05)"
            : "0 12px 48px rgba(255, 255, 255, 0.00)",
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          borderRadius: 31,
        }}
        whileTap={{ scale: 0.975 }}
        transition={{
          ...morphTransition,
          // shadow always eases smoothly regardless of direction
          boxShadow: SHADOW_TRANSITION,
        }}
        className="relative bg-[#292727] border border-white/5 p-3 overflow-hidden cursor-pointer select-none"
      >
        {/* ── shine sweep on press ── */}
        <motion.div
          style={{ x: shineX }}
          className="absolute inset-0 pointer-events-none z-10 -skew-x-12"
          aria-hidden
        >
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        </motion.div>

        {/* ── content ── */}
        <AnimatePresence mode="wait" initial={false}>
          {!expanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88, y: -4 }}
              transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex items-center justify-between gap-6"
            >
              {/* avatar + status dot */}
              <div className="relative shrink-0 size-7">
                <img
                  src={AVATAR_SRC}
                  alt="Abdulquddus"
                  className="size-full rounded-full object-cover"
                />
                <img
                  src={DOT_SRC}
                  alt=""
                  aria-hidden
                  className="absolute bottom-0 right-0 size-[5px] block"
                />
              </div>

              {/* labels */}
              <div className="flex flex-col gap-[10px] grow">
                <span
                  className="text-white font-medium leading-none whitespace-nowrap"
                  style={{ fontSize: 10, letterSpacing: "-0.4px" }}
                >
                  Heyy
                </span>
                <span
                  className="text-white font-medium leading-none whitespace-nowrap"
                  style={{ fontSize: 14, letterSpacing: "-0.56px" }}
                >
                  I&apos;m Abdulquddus
                </span>
              </div>

              {/* chevron */}
              <div className="shrink-0 size-[34px] flex items-center justify-center rounded-[28px] bg-white/15 border border-white/5">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="expanded"
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{
                opacity: { duration: 0.18, delay: 0.06 },
                y:       { type: "spring", stiffness: 280, damping: 22, delay: 0.06 },
                scale:   { duration: 0.18, delay: 0.06 },
              }}
              className="text-[#f0efef] font-normal leading-[1.6]"
              style={{ fontSize: 14, letterSpacing: "-0.14px" }}
            >
              {BIO}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

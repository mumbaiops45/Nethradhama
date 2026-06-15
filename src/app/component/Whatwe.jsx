"use client";

import {motion,AnimatePresence, useScroll, useTransform, useReducedMotion,} from "framer-motion";
import { useRef, useState } from "react";
import { Eye } from "lucide-react";
import { servicess } from "../data/data";

const ACCENT = "#0D8DD7";



export default function Whatwe() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  
  const W = [
    [0.05, 0.2],
    [0.25, 0.4],
    [0.45, 0.6],
    [0.65, 0.8],
  ];

  
  const op = [
    useTransform(scrollYProgress, W[0], [0, 1]),
    useTransform(scrollYProgress, W[1], [0, 1]),
    useTransform(scrollYProgress, W[2], [0, 1]),
    useTransform(scrollYProgress, W[3], [0, 1]),
  ];
  const scale = [
    useTransform(scrollYProgress, W[0], [0.6, 1]),
    useTransform(scrollYProgress, W[1], [0.6, 1]),
    useTransform(scrollYProgress, W[2], [0.6, 1]),
    useTransform(scrollYProgress, W[3], [0.6, 1]),
  ];

  
  const nodePos = [
    "left-1/2 top-[65px] -translate-x-1/2 -translate-y-1/2",
    "left-[415px] top-1/2 -translate-x-1/2 -translate-y-1/2", 
    "left-1/2 top-[415px] -translate-x-1/2 -translate-y-1/2", 
    "left-[65px] top-1/2 -translate-x-1/2 -translate-y-1/2", 
  ];

  
  const spokeEnd = [
    [240, 115],
    [365, 240], 
    [240, 365], 
    [115, 240],
  ];

 
  const ringDot = [
    [240, 140],
    [340, 240],
    [240, 340],
    [140, 240],
  ];

  const active = activeIndex === null ? null : servicess[activeIndex];

  return (
    <section
      ref={ref}
      className="relative bg-gradient-to-b from-white via-sky-50/40 to-white px-4 lg:px-16 lg:h-[340vh]"
    >
      <div className="flex min-h-screen items-center overflow-hidden py-20 lg:sticky lg:top-0 lg:h-screen lg:py-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(13,141,215,0.10),transparent_60%)]" />

        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="lg:grid lg:grid-cols-[minmax(300px,420px)_1fr] lg:items-center lg:gap-12">
            <div className="mb-12 text-left lg:mb-0 lg:text-left">
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ background: "rgba(13,141,215,0.10)", color: ACCENT }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
                What we offer
              </span>

              <div className="relative mt-6 min-h-[230px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex === null ? "intro" : activeIndex}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                  >
                    {active ? (
                      <>
                        <div className="mb-4 flex items-center justify-start gap-3">
                          <span
                            className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${ACCENT}, #38bdf8)` }}
                          >
                            <active.icon size={24} />
                          </span>
                          <span className="font-mono text-sm font-semibold text-slate-300">
                            0{activeIndex + 1}
                          </span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                          {active.title}
                        </h2>
                        <p className=" mt-5 max-w-md text-slate-600">
                          {active.desc}
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-4xl">
                          Training that spans the whole of eye care.
                        </h2>
                        <p className="mx-auto mt-5 max-w-md text-slate-600 lg:mx-0">
                          Hover over a service to explore it. From diagnostics to clinical
                          practice, our programs build expertise and confidence — one rotation
                          at a time.
                        </p>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              
              <div className="mt-6 hidden items-center gap-2.5 lg:flex">
                {servicess.map((_, i) => (
                  <motion.span
                    key={i}
                    onMouseEnter={() => setActiveIndex(i)}
                    style={{ background: ACCENT }}
                    animate={{
                      opacity: activeIndex === i ? 1 : 0.3,
                      scale: activeIndex === i ? 1.4 : 1,
                    }}
                    className="h-2 w-2 cursor-pointer rounded-full"
                  />
                ))}
                <span className="ml-3 text-sm text-slate-500">Hover to explore</span>
              </div>
            </div>

            <div
              className="relative mx-auto hidden h-[480px] w-[480px] max-w-full lg:block"
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200" />
              <div className="absolute left-1/2 top-1/2 h-[152px] w-[152px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-100" />
              <div className="absolute left-1/2 top-1/2 h-[104px] w-[104px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-50" />

              <svg
                viewBox="0 0 480 480"
                preserveAspectRatio="xMidYMid meet"
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                {spokeEnd.map(([x, y], i) => (
                  <motion.line
                    key={`l-${i}`}
                    x1={240}
                    y1={240}
                    x2={x}
                    y2={y}
                    stroke={ACCENT}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    style={{ pathLength: op[i], opacity: activeIndex === i ? 0.85 : 0.35 }}
                  />
                ))}
                {ringDot.map(([x, y], i) => (
                  <motion.circle
                    key={`d-${i}`}
                    cx={x}
                    cy={y}
                    r={4}
                    fill={ACCENT}
                    style={{ opacity: op[i] }}
                  />
                ))}
              </svg>

              <motion.div
                animate={reduced ? {} : { rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-sky-200 will-change-transform"
              >
                <span
                  className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_12px_rgba(13,141,215,0.6)]"
                  style={{ background: ACCENT }}
                />
              </motion.div>

              <div className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_20px_80px_rgba(13,141,215,0.14)]">
                {!reduced &&
                  [0, 1].map((k) => (
                    <motion.span
                      key={k}
                      className="absolute h-16 w-16 rounded-full border will-change-transform"
                      style={{ borderColor: ACCENT }}
                      animate={{ scale: [1, 1.9], opacity: [0.45, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: k * 1.5, ease: "easeOut" }}
                    />
                  ))}
                <motion.div
                  animate={reduced ? {} : { scale: [1, 1.06, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative flex h-16 w-16 items-center justify-center rounded-full text-white shadow-2xl will-change-transform"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, #38bdf8)` }}
                >
                  <Eye size={28} />
                </motion.div>
              </div>

             
              {servicess.map((service, i) => (
                <motion.button
                  key={service.title}
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  style={{ opacity: op[i], scale: scale[i] }}
                  className={`absolute z-20 ${nodePos[i]} will-change-transform`}
                >
                  <OrbitNode service={service} index={i} active={activeIndex === i} />
                </motion.button>
              ))}
            </div>
          </div>

        
          <div className="grid gap-5 sm:grid-cols-2 lg:hidden">
            {servicess.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <ServiceCard service={service} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function OrbitNode({ service, index, active }) {
  const Icon = service.icon;
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative flex h-[104px] w-[104px] cursor-pointer items-center justify-center rounded-full border-2 bg-white transition-shadow duration-300"
      style={{
        borderColor: active ? ACCENT : "transparent",
        boxShadow: active
          ? "0 18px 50px -12px rgba(13,141,215,0.5)"
          : "0 12px 38px rgba(15,23,42,0.10)",
      }}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300"
        style={{ background: `linear-gradient(135deg, ${ACCENT}, #38bdf8)` }}
      >
        <Icon size={24} />
      </div>
      <span
        className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-mono font-semibold shadow-[0_4px_12px_rgba(15,23,42,0.12)]"
        style={{ color: active ? ACCENT : "#cbd5e1" }}
      >
        0{index + 1}
      </span>
    </motion.div>
  );
}


function ServiceCard({ service, index }) {
  const Icon = service.icon;
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="group w-full"
    >
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-shadow duration-300 group-hover:shadow-[0_22px_60px_-15px_rgba(13,141,215,0.35)]">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "rgba(13,141,215,0.18)" }}
        />
        <div className="relative flex items-center justify-between">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #38bdf8)` }}
          >
            <Icon size={26} />
          </div>
          <span className="font-mono text-sm font-semibold text-slate-300">
            0{index + 1}
          </span>
        </div>
        <h3 className="relative mt-4 text-lg font-semibold text-slate-900">
          {service.title}
        </h3>
        <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
          {service.desc}
        </p>
      </div>
    </motion.div>
  );
}
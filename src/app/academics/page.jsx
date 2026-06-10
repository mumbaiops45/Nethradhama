"use client"
import React, { useState, useEffect, useRef } from "react";


function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

function useParallax(speed = 0.2, max = Infinity) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const centerDelta = rect.top + rect.height / 2 - viewH / 2;
      setOffset(Math.max(-max, Math.min(max, -centerDelta * speed)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed, max]);
  return [ref, offset];
}

function useCountUp(to, run, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) {
      setVal(to);
      return;
    }
    let raf, start;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, duration]);
  return val;
}

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full">
      <div className="h-full bg-[#0D8DD7] transition-[width] duration-150 ease-out" style={{ width: `${p}%` }} />
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, shown] = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Lens({ className = "" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <circle cx="24" cy="24" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <circle cx="24" cy="24" r="7" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function Eyebrow({ children, light = false }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      <span className={light ? "text-sky-100" : "text-[#0D8DD7]"}>{children}</span>
    </span>
  );
}

function Stat({ to, suffix = "", label }) {
  const [ref, shown] = useReveal();
  const val = useCountUp(to, shown);
  return (
    <div ref={ref}>
      <div className="font-serif text-3xl font-semibold text-slate-900">
        {val}
        {suffix}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

function ParallaxImage({ src, alt, className = "", rounded = "rounded-3xl" }) {
  const [ref, y] = useParallax(0.07, 22);
  return (
    <div className={`relative overflow-hidden ${rounded} bg-slate-200 ${className}`}>
      <div ref={ref} className="absolute inset-0 will-change-transform" style={{ transform: `translateY(${y}px)` }}>
        <img src={src} alt={alt} loading="lazy" className="h-full w-full scale-110 object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
    </div>
  );
}


const Icon = {
  doc: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <path d="M6 2h8l4 4v16H6z" strokeLinejoin="round" />
      <path d="M14 2v4h4M9 13h6M9 17h6" strokeLinecap="round" />
    </svg>
  ),
  pencil: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <path d="M4 20h4L19 9l-4-4L4 16v4Z" strokeLinejoin="round" />
      <path d="M14 6l4 4" strokeLinecap="round" />
    </svg>
  ),
  chat: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <path d="M4 5h16v11H9l-5 4V5Z" strokeLinejoin="round" />
    </svg>
  ),
  globe: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18" />
    </svg>
  ),
  award: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13.5 8 22l4-2 4 2-1-8.5" strokeLinejoin="round" />
    </svg>
  ),
  check: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="2">
      <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};


const journey = [
  { tag: "Year 1", title: "Foundations", desc: "Core sciences of vision and the groundwork of clinical optometry." },
  { tag: "Year 2", title: "Clinical Sciences", desc: "Refraction, diagnostics and the principles of patient care." },
  { tag: "Year 3", title: "Advanced Practice", desc: "Specialty training with supervised clinical postings." },
  { tag: "Year 4", title: "Internship", desc: "One compulsory year across every branch of Nethradhama Hospitals." },
];

const subjects = ["English", "Physics", "Chemistry", "Biology / Maths"];

const selection = [
  { icon: Icon.doc, title: "10+2 Marks", desc: "Your higher secondary academic performance is the first measure." },
  { icon: Icon.pencil, title: "Written Test", desc: "An entrance assessment of aptitude and core knowledge." },
  { icon: Icon.chat, title: "Personal Interview", desc: "A one-on-one conversation to gauge fit and motivation." },
];

const highlights = [
  {
    icon: Icon.doc,
    title: "Evaluation",
    desc: "Three internal assessments and a term-end exam every year, with equal weightage across theory and practical. A minimum of 50% in the term-end exam is required to progress. The degree is awarded after three academic years and one year of internship.",
  },
  {
    icon: Icon.globe,
    title: "Medium of Instruction",
    desc: "Both theory and practical instruction are conducted in English, and candidates are expected to write their examinations in English only.",
  },
  {
    icon: Icon.award,
    title: "Academic Achievements",
    desc: "Our students have consistently secured ranks in university examinations conducted by Rajiv Gandhi University of Health Sciences (RGUHS), Karnataka.",
  },
];

const IMG = {
  hero: "/3yrsstudy.avif",
  eligibility: "/apply.png",
  evaluation: "/assessment.png",
};


export default function Page() {
  const [heroL1, heroL1Y] = useParallax(0.24);
  const [heroL2, heroL2Y] = useParallax(0.15);
  const [heroImg, heroImgY] = useParallax(0.06, 28);
  const [selLens, selLensY] = useParallax(0.18);
  const [ctaLens, ctaLensY] = useParallax(0.14, 60);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-700 antialiased selection:bg-[#0D8DD7]">
      <ScrollProgress />

      <section className="relative overflow-hidden">
        <div ref={heroL1} style={{ transform: `translateY(${heroL1Y}px)` }} className="pointer-events-none absolute -right-16 -top-12 will-change-transform">
          <Lens className="h-72 w-72 text-[#0D8DD7]/50" />
        </div>
        <div ref={heroL2} style={{ transform: `translateY(${heroL2Y}px)` }} className="pointer-events-none absolute -bottom-28 -left-24 will-change-transform">
          <Lens className="h-80 w-80 text-amber-200/50" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
          <Reveal>
            <Eyebrow>Academics · B.Sc. Optometry</Eyebrow>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] text-slate-900 sm:text-5xl lg:text-6xl">
              Three years of study.
              <br />
              <span className="text-[#0D8DD7]">A lifetime of sight.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600">
              NSO offers a four-year Bachelor of Science in Optometry affiliated with RGUHS, Karnataka  three academic years of certified study followed by one year of compulsory internship.
            </p>
            <div className="mt-10 flex flex-wrap gap-8 border-t border-stone-200 pt-6 sm:gap-12">
              <Stat to={4} suffix=" yrs" label="Full program" />
              <Stat to={3} label="Academic years" />
              <Stat to={1} suffix=" yr" label="Internship" />
              <Stat to={50} suffix="%" label="Min. to pass" />
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative overflow-hidden rounded-3xl bg-slate-200 shadow-xl shadow-slate-900/10 aspect-[4/3]">
              <div ref={heroImg} style={{ transform: `translateY(${heroImgY}px)` }} className="absolute inset-0 will-change-transform">
                <img src={IMG.hero} alt="Optometry student during a clinical session" loading="lazy" className="h-full w-full scale-110 object-cover" />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="max-w-2xl">
            <Eyebrow>Program Offered</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
              How four years come together.
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              A certified study extending over three academic years  theory, practical and clinical sessions  followed by a full year of internship across the specialties of Nethradhama Hospitals.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {journey.map((j, i) => (
              <Reveal key={j.tag} delay={i * 90}>
                <div className="group relative h-full rounded-2xl border border-stone-200 bg-stone-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#0D8DD7]/30 hover:shadow-xl hover:shadow-slate-900/5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-5xl font-semibold text-[#0D8DD7]/15 transition-colors group-hover:text-[#0D8DD7]/30">
                      0{i + 1}
                    </span>
                    <span className="rounded-full bg-[#0D8DD7]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0D8DD7]">
                      {j.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-slate-900">{j.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{j.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

     
      <section className="bg-stone-50">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2">
          <Reveal delay={150} className="md:order-2">
            <ParallaxImage src={IMG.eligibility} alt="Students preparing for optometry" className="aspect-[4/3] md:aspect-[4/3]" />
          </Reveal>
          <Reveal className="md:order-1">
            <Eyebrow>Eligibility Criteria</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              Who can apply.
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              Candidates must have obtained <strong className="font-semibold text-slate-900">50% marks taken together</strong> in the following subjects at the higher secondary (10+2) examination:
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {subjects.map((s) => (
                <span key={s} className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                  {Icon.check("h-4 w-4 text-[#0D8DD7]")} {s}
                </span>
              ))}
            </div>
            <div className="mt-6 space-y-3 rounded-2xl border border-[#0D8DD7]/20 bg-[#0D8DD7]/5 p-5 text-sm leading-relaxed text-slate-700">
              <p><strong className="font-semibold text-slate-900">Lateral entry:</strong> candidates who have completed a 2–3 year diploma in optometry may take admission directly into the second year.</p>
              <p>Promotion to the next class is subject to satisfactory progress, behaviour and attendance.</p>
            </div>
          </Reveal>
        </div>
      </section>

    
      <section className="relative overflow-hidden bg-white">
        <div ref={selLens} style={{ transform: `translateY(${selLensY}px)` }} className="pointer-events-none absolute -right-24 top-12 will-change-transform">
          <Lens className="h-72 w-72 text-[#0D8DD7]/10" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20">
          <Reveal className="max-w-2xl">
            <Eyebrow>Selection Criteria</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
              Three steps to a seat.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {selection.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <div className="relative h-full rounded-2xl border border-stone-200 bg-stone-50 p-7">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0D8DD7]/10 text-[#0D8DD7]">
                      {s.icon("h-6 w-6")}
                    </div>
                    <span className="font-serif text-2xl font-semibold text-slate-300">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <p className="mt-8 text-sm text-slate-500">
              The course commences every <strong className="font-semibold text-slate-700">August</strong>  a full-time program of theory, practical and clinical sessions.
            </p>
          </Reveal>
        </div>
      </section>

     
      <section className="bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <Reveal>
              <Eyebrow>Assessment</Eyebrow>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
                Measured, year after year.
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                Continuous evaluation keeps learning on track  equal weightage for internal assessments and term-end exams, across both theory and practical.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <ParallaxImage src={IMG.evaluation} alt="Clinical evaluation" className="aspect-[16/10]" />
            </Reveal>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 90}>
                <div className="h-full rounded-2xl border border-stone-200 bg-white p-7">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#0D8DD7]/10 text-[#0D8DD7]">
                    {h.icon("h-6 w-6")}
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-semibold text-slate-900">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{h.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

     
      <section className="bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 pb-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-[#0D8DD7] p-8 text-sky-50 sm:p-12">
              <div ref={ctaLens} style={{ transform: `translateY(${ctaLensY}px)` }} className="pointer-events-none absolute -right-12 -top-12 will-change-transform">
                <Lens className="h-60 w-60 text-white/15" />
              </div>
              <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div className="max-w-xl">
                  <Eyebrow light>Admissions</Eyebrow>
                  <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight sm:text-3xl">
                    Ready to begin your B.Sc. Optometry?
                  </h2>
                  <p className="mt-2 text-sky-50/90">
                    Admissions for 2025–26 are open. Talk to our administrator to get started.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3">
                  <a href="tel:+917760744990" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0D8DD7] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    Call +91 77607 44990
                  </a>
                  <a href="mailto:optoschool@nethradhama.org" className="rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                    Email us
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
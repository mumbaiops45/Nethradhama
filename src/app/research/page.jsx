"use client"
import React, { useState, useEffect, useRef } from "react";


function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) { setShown(true); return; }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setShown(true); io.unobserve(el); }
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
    let raf = 0, current = 0, target = 0;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const centerDelta = rect.top + rect.height / 2 - viewH / 2;
      target = Math.max(-max, Math.min(max, -centerDelta * speed));
    };
    const loop = () => {
      current += (target - current) * 0.08;
      setOffset(current);
      if (Math.abs(target - current) > 0.08) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const onScroll = () => { measure(); if (!raf) raf = requestAnimationFrame(loop); };
    measure(); current = target; setOffset(current);
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
    if (reduce) { setVal(to); return; }
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
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        } ${className}`}
    >
      {children}
    </div>
  );
}


function LineReveal({ children, delay = 0, className = "" }) {
  const [ref, shown] = useReveal();
  return (
    <span ref={ref} className="block overflow-hidden pb-[0.12em]">
      <span
        style={{ transitionDelay: `${delay}ms` }}
        className={`block transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${shown ? "translate-y-0" : "translate-y-[120%]"
          } ${className}`}
      >
        {children}
      </span>
    </span>
  );
}


function FlyInCard({ children, index = 0, className = "" }) {
  const [ref, shown] = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 110}ms` }}
      className={`transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${shown
          ? "opacity-100 translate-y-0 scale-100 blur-0"
          : "opacity-0 translate-y-16 scale-95 blur-[6px]"
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
    <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em]">
      <span className={`h-px w-8 ${light ? "bg-sky-200" : "bg-[#0D8DD7]"}`} />
      <span className={light ? "text-sky-100" : "text-[#0D8DD7]"}>{children}</span>
    </span>
  );
}

function Stat({ to, suffix = "", prefix = "", label }) {
  const [ref, shown] = useReveal();
  const val = useCountUp(to, shown);
  return (
    <div ref={ref}>
      <div className="text-3xl font-semibold text-slate-900">
        {prefix}{val}{suffix}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}


function ParallaxImage({ src, alt, className = "", rounded = "rounded-3xl" }) {
  const [ref, y] = useParallax(0.09, 28);
  return (
    <div className={`group relative overflow-hidden ${rounded} bg-slate-200 shadow-[0_25px_70px_-25px_rgba(15,23,42,0.35)] ${className}`}>
      <div ref={ref} className="absolute inset-0 will-change-transform" style={{ transform: `translateY(${y}px)` }}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full scale-[1.18] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.25]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/15 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
    </div>
  );
}

const Icon = {
  eye: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  lens: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 5 5" strokeLinecap="round" />
    </svg>
  ),
  child: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="7" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" strokeLinecap="round" />
    </svg>
  ),
  scope: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <path d="M12 4v8m0 0a4 4 0 0 0 4 4h1M12 12a4 4 0 0 1-4 4H7M5 20h14" strokeLinecap="round" />
      <circle cx="12" cy="4" r="1.4" />
    </svg>
  ),
  community: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <circle cx="8" cy="9" r="3" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M2 20a6 6 0 0 1 12 0M14.5 20a5 5 0 0 1 7.5-4.3" strokeLinecap="round" />
    </svg>
  ),
  balance: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3v18M5 21h14M6 7h12M6 7 3 13h6L6 7Zm12 0-3 6h6l-3-6Z" strokeLinejoin="round" />
    </svg>
  ),
};


const areas = [
  { icon: Icon.eye, title: "Refractive Error & Myopia", desc: "Understanding how the eye focuses and how to correct and manage it.", img: "/Refractive.png" },
  { icon: Icon.lens, title: "Contact Lens & Anterior Segment", desc: "Fitting, ocular surface health and the science of the front of the eye.", img: "/Contact Lens.png" },
  { icon: Icon.scope, title: "Ocular Diagnostics", desc: "Early detection and measurement of conditions across the visual system.", img: "/OcularDiagnostics.png" },
  { icon: Icon.balance, title: "Binocular Vision & Squint", desc: "How the two eyes work together, and non-surgical intervention.", img: "/Binocular.png" },
  { icon: Icon.child, title: "Low Vision & Rehabilitation", desc: "Aids and strategies that restore independence and quality of life.", img: "/LowVision.png" },
  { icon: Icon.community, title: "Community & Public Health", desc: "Vision screening and outreach that take eye care beyond the clinic.", img: "/Community.png" },
];

const students = ["Ms. Nikhita R Bhat", "Ms. Pooja Kumari Sah", "Mr. Anvith M Agumbe"];

const IMG = {
  hero: "/Curiosity.avif",
  curriculum: "/studentresearch.jpg",
};

const initials = (name) =>
  name
    .split(" ")
    .filter((w) => !["Ms.", "Mr.", "Dr."].includes(w))
    .map((w) => w[0])
    .join("")
    .slice(0, 2);


export default function Page() {
  const [heroL1, heroL1Y] = useParallax(0.24);
  const [heroL2, heroL2Y] = useParallax(0.15);
  const [heroImg, heroImgY] = useParallax(0.08, 30);
  const [areaLens, areaLensY] = useParallax(0.18);
  const [grantLens, grantLensY] = useParallax(0.14, 60);

  return (
    <div className="min-h-screen bg-stone-50 text-slate-700 antialiased selection:bg-[#0D8DD7] selection:text-white">

      <style>{`
        :root { --font-display: 'Fraunces', 'Playfair Display', Georgia, 'Times New Roman', serif; }
        .font-display {  letter-spacing: -0.01em; }
      `}</style>

      <ScrollProgress />


      <section className="relative overflow-hidden">
        <div ref={heroL1} style={{ transform: `translateY(${heroL1Y}px)` }} className="pointer-events-none absolute -right-16 -top-12 will-change-transform">
          <Lens className="h-72 w-72 text-[#0D8DD7]/50" />
        </div>
        <div ref={heroL2} style={{ transform: `translateY(${heroL2Y}px)` }} className="pointer-events-none absolute -bottom-28 -left-24 will-change-transform">
          <Lens className="h-80 w-80 text-sky-200/50" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 md:grid-cols-2 md:py-28">
          <Reveal>
            <Eyebrow>Research at NSO</Eyebrow>
            <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl lg:text-6xl">
              <LineReveal delay={100}>Curiosity, brought</LineReveal>
              <LineReveal delay={220} className="text-[#0D8DD7]">into focus.</LineReveal>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600">
              NSO is committed to continually strengthening its academic activities and research programs — backed by high standards of education, training and clinical experience, and a comprehensive curriculum built for inquiry.
            </p>
            <div className="mt-10 flex flex-wrap gap-8 border-t border-stone-200 pt-6 sm:gap-12">
              <Stat to={2022} label="RGUHS grant year" />
              <Stat to={3} label="Funded scholars" />
              <Stat to={6} suffix="+" label="Areas of inquiry" />
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-200 shadow-[0_25px_70px_-25px_rgba(15,23,42,0.4)]">
              <div ref={heroImg} style={{ transform: `translateY(${heroImgY}px)` }} className="absolute inset-0 will-change-transform">
                <img src={IMG.hero} alt="Optometry research in progress" loading="lazy" className="h-full w-full scale-[1.18] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.25]" />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white">
        <div ref={areaLens} style={{ transform: `translateY(${areaLensY}px)` }} className="pointer-events-none absolute -right-24 top-16 will-change-transform">
          <Lens className="h-72 w-72 text-[#0D8DD7]/10" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-24">
          <Reveal className="max-w-2xl">
            <Eyebrow>Areas of Inquiry</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Where optometry research looks next.
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Our curriculum and clinical setting open doors to study across the breadth of vision science — the same domains our students train in every day.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
            {areas.map((a, i) => {
              return (
                <Reveal key={a.title} delay={i * 60}>
                  <div className="group relative h-72 overflow-hidden rounded-2xl border border-stone-200 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[#0D8DD7]/30 hover:shadow-xl">

                    <img
                      src={a.img}
                      alt={a.title}
                      className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
                      {a.title}
                    </div>

                    <div className="absolute inset-0 flex items-end">
                      <div className="w-full translate-y-full bg-gradient-to-t from-black/80 via-black/50 to-transparent p-5 text-white transition-all duration-500 group-hover:translate-y-0">
                        <p className="text-sm leading-relaxed opacity-0 transition-opacity duration-300 group-hover:opacity-100">{a.desc}</p>
                      </div>

                    </div>
                  </div>

                </Reveal>
              )
            })}

          </div>
        </div>
      </section>


      <section className="bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-[#0D8DD7] p-8 text-sky-50 shadow-[0_25px_80px_rgba(13,141,215,0.25)] sm:p-12">
              <div ref={grantLens} style={{ transform: `translateY(${grantLensY}px)` }} className="pointer-events-none absolute -right-12 -top-12 will-change-transform">
                <Lens className="h-64 w-64 text-white/15" />
              </div>
              <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
              <div className="relative">
                <Eyebrow light>Funded Research · 2021–22</Eyebrow>
                <h2 className="font-display mt-4 max-w-3xl text-2xl font-semibold leading-snug sm:text-3xl">
                  Three of our students were selected for the RGUHS UG-AHS research grant.
                </h2>
                <p className="mt-3 max-w-2xl text-sky-50/90">
                  Recognised by Rajiv Gandhi University of Health Sciences under its Undergraduate Allied Health Sciences research grant for the year 2021–22.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {students.map((s, i) => (
                    <FlyInCard key={s} index={i}>
                      <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm transition-all duration-300 hover:bg-white/15">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-sm font-semibold text-[#0D8DD7]">
                          {initials(s)}
                        </span>
                        <span className="text-sm font-medium text-white">{s}</span>
                      </div>
                    </FlyInCard>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 md:grid-cols-2">
          <Reveal delay={150} className="md:order-2">
            <ParallaxImage src={IMG.curriculum} alt="Clinical training that feeds research" className="aspect-[4/3] w-full" />
          </Reveal>
          <Reveal className="md:order-1">
            <Eyebrow>The NSO Advantage</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              Research grows where practice lives.
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-slate-600">
              <p>
                Run by Nethradhama Super Speciality Eye Hospital, NSO places students inside a real centre of excellence — where questions worth researching surface in the clinic, every single day.
              </p>
              <p>
                A comprehensive curriculum, hands-on clinical exposure and continually upgraded technology give students the foundation to ask sharper questions, design honest studies and contribute to the science of sight.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-24">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-[#0D8DD7]/20 bg-[#0D8DD7]/5 p-8 sm:flex-row sm:items-center sm:p-10">
              <div className="max-w-xl">
                <Eyebrow>Get in touch</Eyebrow>
                <h2 className="font-display mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
                  Curious about research at NSO?
                </h2>
                <p className="mt-2 text-slate-600">
                  Reach our administrator to learn about projects, mentorship and opportunities.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <a href="tel:+917760744990" className="rounded-full bg-[#0D8DD7] px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(13,141,215,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_rgba(13,141,215,0.7)]">
                  Call +91 77607 44990
                </a>
                <a href="mailto:optoschool@nethradhama.org" className="rounded-full border border-stone-300 px-7 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-[#0D8DD7] hover:text-[#0D8DD7]">
                  Email us
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
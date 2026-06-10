"use client"
import React, { useState, useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────────
   NSO Faculty & Team
   PHOTOS: every person has a `photo` path wired below. Drop the matching
   image into  public/faculty/<file>.jpg  and it appears automatically.
   No file yet (or wrong path)? The Avatar falls back to monogram initials
   via onError the page never shows a broken image.
   ────────────────────────────────────────────────────────────── */

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
      { threshold: 0.12 }
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
      <div className=" text-3xl font-semibold text-slate-900">
        {val}
        {suffix}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

const initials = (name) =>
  name
    .replace(/\b(Dr|Mr|Mrs|Ms)\.?\b/g, "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();


function Avatar({ name, photo, size = "h-16 w-16", text = "text-lg", ring = "ring-[#0D8DD7]/15" }) {
  const [failed, setFailed] = useState(false);
  const showImg = photo && !failed;
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full bg-[#0D8DD7]/10 ring-1 ${ring} ${size}`}>
      {showImg ? (
        <img
          src={photo}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className={`grid h-full w-full place-items-center  font-semibold text-[#0D8DD7] ${text}`}>
          {initials(name)}
        </span>
      )}
    </div>
  );
}


const management = [
  { name: "Dr. Sri Ganesh", role: "Chairman & Managing Director", org: "Nethradhama Hospitals Pvt Ltd.", qual: "MBBS, MS, DNB", photo: "/ganesh.jpg" },
  { name: "Dr. Suman Shree R", role: "Director & CEO", org: "Nethradhama Hospitals Pvt Ltd.", qual: "MBBS, MD, DNB (Anaesthesiology), PGDHHM, PGDMLS", photo: "/suman.jpg" },
  { name: "Dr. Savitha Arun", role: "Principal / Professor", org: "Subject Squint & BV", qual: "MBBS, DOMS, DNB", photo: "/savitha.jpg" },
];

const optometryFaculty = [
  { name: "Mr. Rahul Roy", role: "Vice Principal & Assistant Professor", subject: "CEVS & Optometric Instruments, LVA & Geriatric, Binocular Vision", qual: "M.Optom", photo: "/rahul.jpg" },
  { name: "Mr. Anand P", role: "Lecturer", subject: "Basic Biochemistry & Nutrition, Microbiology", qual: "MSc", photo: "/AnandP.jpg" },
  { name: "Mrs. Sheethal Pai H", role: "Tutor", subject: "Ocular Anatomy, Pediatric Optometry & Ocular Diseases", qual: "BSc Opt, FLVPEI", photo: "/sheethal.jpg" },
  { name: "Mr. Sharath N S", role: "Tutor", subject: "Visual Optics", qual: "BSc Opt", photo: "/sharathns.jpg" },
  { name: "Mr. Chethan M", role: "Assistant Professor", subject: "Physical & Geometric Optics", qual: "M.Sc.", photo: "/chethanm.jpg" },
  { name: "Mrs. Deepa G K", role: "Tutor", subject: "Dispensing Optics", qual: "BSc Opt", photo: "/deepa.jpg" },
  { name: "Mr. J Sachin Singh", role: "Lecturer", subject: "Ocular Physiology, Ocular Biochemistry, CL, Squint", qual: "M.Optom", photo: "/sachin.jpg" },
  { name: "Ms. Renukha Parameswari S", role: "Lecturer", subject: "LVA & Optometric Optics", qual: "M.Optom", photo: "/renukha.jpg" },
];

const visitingFaculty = [
  { name: "Dr. Vanitha Ramaswamy", role: "Professor", subject: "English", qual: "PhD (English)", photo: "/vanitha.jpg" },
  { name: "Dr. Jahanzeb", role: "Lecturer", subject: "General Anatomy", qual: "M.Sc (Anatomy), MBA (Hosp Admin), Ph.D (Human Anatomy)", photo: "/jahanzeb.jpg" },
  { name: "Mrs. Shobha Rani", role: "Lecturer", subject: "Law & Optometry", qual: "LLB, LLM", photo: "/sobha.jpg" },
  { name: "Mr. Manjunatha R", role: "Professor", subject: "Mathematics", qual: "M.Sc, M.Phil, B.Ed", photo: "/manjunatha.jpeg" },
  { name: "Mrs. Swarnashree P", role: "Lecturer", subject: "Basic Accountancy", qual: "B.Com, ICWA", photo: "/swarnashreep.jpg" },
  { name: "Dr. Yogeesh S N", role: "Lecturer", subject: "General Physiology", qual: "MBBS, MD, PGDHA, PGDHS", photo: "/yogeesh.jpg" },
];

const administration = [
  { name: "Mrs. N Shalini", role: "Executive Administrator", subject: "Administration", qual: "B.Sc Computer Science", photo: "/shalini.jpeg" },
];

function FacultyCard({ p }) {
  return (
    <div className="group flex h-full gap-4 rounded-2xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0D8DD7]/30 hover:shadow-xl hover:shadow-slate-900/5">
      <Avatar name={p.name} photo={p.photo} />
      <div className="min-w-0">
        <h3 className=" text-lg font-semibold leading-tight text-slate-900">{p.name}</h3>
        <p className="mt-0.5 text-sm font-medium text-[#0D8DD7]">{p.role}</p>
        {p.subject && <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.subject}</p>}
        <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">{p.qual}</p>
      </div>
    </div>
  );
}

export default function Page() {
  const [heroL1, heroL1Y] = useParallax(0.24);
  const [heroL2, heroL2Y] = useParallax(0.15);
  const [optLens, optLensY] = useParallax(0.16);
  const [visLens, visLensY] = useParallax(0.16);

  return (
    <div className="min-h-screen bg-stone-50  text-slate-700 antialiased selection:bg-[#0D8DD7]">
      <ScrollProgress />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div ref={heroL1} style={{ transform: `translateY(${heroL1Y}px)` }} className="pointer-events-none absolute -right-16 -top-12 will-change-transform">
          <Lens className="h-72 w-72 text-[#0D8DD7]/50" />
        </div>
        <div ref={heroL2} style={{ transform: `translateY(${heroL2Y}px)` }} className="pointer-events-none absolute -bottom-28 -left-24 will-change-transform">
          <Lens className="h-80 w-80 text-amber-200/50" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <Reveal className="max-w-3xl">
            <Eyebrow>Management &amp; Faculty</Eyebrow>
            <h1 className="mt-5  text-4xl font-semibold leading-[1.08] text-slate-900 sm:text-5xl lg:text-6xl">
              The people behind
              <br />
              <span className="text-[#0D8DD7]">every clear diagnosis.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              From hospital leadership to optometry educators and visiting specialists a team that brings clinical depth and academic rigour to every classroom at NSO.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-12 flex flex-wrap gap-10 border-t border-stone-200 pt-8 sm:gap-16">
              <Stat to={3} label="Leadership" />
              <Stat to={8} label="Optometry faculty" />
              <Stat to={6} label="Visiting faculty" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Management Team */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="max-w-2xl">
            <Eyebrow>Management Team</Eyebrow>
            <h2 className="mt-4  text-3xl font-semibold text-slate-900 sm:text-4xl">
              Guided by experienced clinicians.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {management.map((m, i) => (
              <Reveal key={m.name} delay={i * 90}>
                <div className="group h-full overflow-hidden rounded-3xl border border-stone-200 bg-stone-50 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
                  <div className="flex justify-center">
                    <Avatar name={m.name} photo={m.photo} size="h-24 w-24" text="text-2xl" />
                  </div>
                  <h3 className="mt-5  text-xl font-semibold text-slate-900">{m.name}</h3>
                  <p className="mt-1 text-sm font-medium text-[#0D8DD7]">{m.role}</p>
                  <p className="mt-1 text-sm text-slate-500">{m.org}</p>
                  <div className="mx-auto mt-4 w-12 border-t border-stone-200" />
                  <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">{m.qual}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Optometry Faculty */}
      <section className="relative overflow-hidden bg-stone-50">
        <div ref={optLens} style={{ transform: `translateY(${optLensY}px)` }} className="pointer-events-none absolute -right-24 top-16 will-change-transform">
          <Lens className="h-72 w-72 text-[#0D8DD7]/10" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20">
          <Reveal className="max-w-2xl">
            <Eyebrow>Optometry Faculty</Eyebrow>
            <h2 className="mt-4  text-3xl font-semibold text-slate-900 sm:text-4xl">
              Educators who practise what they teach.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {optometryFaculty.map((p, i) => (
              <Reveal key={p.name} delay={(i % 2) * 90}>
                <FacultyCard p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Visiting Faculty */}
      <section className="relative overflow-hidden bg-white">
        <div ref={visLens} style={{ transform: `translateY(${visLensY}px)` }} className="pointer-events-none absolute -left-24 top-16 will-change-transform">
          <Lens className="h-72 w-72 text-amber-300/10" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20">
          <Reveal className="max-w-2xl">
            <Eyebrow>Visiting Faculty</Eyebrow>
            <h2 className="mt-4  text-3xl font-semibold text-slate-900 sm:text-4xl">
              Specialists across the sciences.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visitingFaculty.map((p, i) => (
              <Reveal key={p.name} delay={(i % 3) * 80}>
                <FacultyCard p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Administration */}
      <section className="bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-20 pb-24">
          <Reveal className="max-w-2xl">
            <Eyebrow>Administrative Department</Eyebrow>
            <h2 className="mt-4  text-3xl font-semibold text-slate-900 sm:text-4xl">
              Keeping everything in order.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {administration.map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <FacultyCard p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
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
      const raw = -centerDelta * speed;
      setOffset(Math.max(-max, Math.min(max, raw)));
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


function useScrollSpy(ids, offset = 140) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids, offset]);
  return active;
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
  eye: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  flask: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" strokeLinejoin="round" />
      <path d="M7.5 15h9" strokeLinecap="round" />
    </svg>
  ),
  board: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="4" width="18" height="13" rx="1.5" />
      <path d="M9 21h6M12 17v4" strokeLinecap="round" />
    </svg>
  ),
  monitor: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" strokeLinecap="round" />
    </svg>
  ),
  users: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <circle cx="8" cy="9" r="3" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M2 20a6 6 0 0 1 12 0M14.5 20a5 5 0 0 1 7.5-4.3" strokeLinecap="round" />
    </svg>
  ),
  book: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" strokeLinejoin="round" />
      <path d="M19 17H6" strokeLinecap="round" />
    </svg>
  ),
  pin: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  download: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};


const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "about", label: "About NSO" },
  { id: "history", label: "History" },
  { id: "facilities", label: "Facilities" },
  { id: "departments", label: "Departments" },
  { id: "academics", label: "Academics" },
  { id: "research", label: "Research" },
  { id: "admissions", label: "Admissions" },
  { id: "brochure", label: "Brochure" },
  { id: "antiragging", label: "Anti-Ragging" },
];
const SECTION_IDS = SECTIONS.map((s) => s.id);

const leadership = [
  { name: "Dr. Sri Ganesh", role: "Chairman & Managing Director" },
  { name: "Dr. Suman Shree", role: "CEO & Director" },
  { name: "Dr. Savitha Arun", role: "Principal" },
];

const facilities = [
  { icon: Icon.board, title: "Spacious Classrooms", desc: "Comfortable, well-lit lecture rooms sized for focused learning." },
  { icon: Icon.flask, title: "Optics Laboratory", desc: "A fully equipped optics lab for hands-on practical sessions." },
  { icon: Icon.eye, title: "Refraction Practice Room", desc: "A dedicated space to master refraction before clinical postings." },
  { icon: Icon.monitor, title: "Demonstration Room", desc: "Live demonstrations of instruments and clinical procedures." },
  { icon: Icon.users, title: "Conference Hall", desc: "For seminars, guest lectures and academic gatherings." },
  { icon: Icon.book, title: "Library & Internet", desc: "A constantly updated optometry library with internet access." },
];

const departments = [
  "Department of Optometry",
  "Laboratory",
  "Clinical Departments",
  "Information Technology",
  "Human Resource",
  "Administration",
  "Accounts",
  "Business Development",
];

const academics = [
  { k: "Program Offered", v: "4-year B.Sc. in Optometry affiliated with RGUHS, Karnataka three academic years followed by one year of compulsory internship." },
  { k: "Eligibility", v: "50% aggregate in English, Physics, Chemistry and Biology/Mathematics at 10+2. Diploma holders may join directly in the second year." },
  { k: "Selection", v: "Based on 10+2 marks, a written test and performance in a personal interview." },
  { k: "Academic Session", v: "The course begins every August a full-time program of theory, practical and clinical sessions." },
  { k: "Evaluation", v: "Three internal assessments and a term-end exam each year with equal weightage; a minimum of 50% in the term-end exam is required." },
  { k: "Achievements", v: "Our students have secured ranks in university examinations conducted by RGUHS, Karnataka." },
  { k: "Medium of Instruction", v: "All theory and practical instruction and examinations are conducted in English." },
];

const history = [
  { year: "2010", text: "NSO is established as Bangalore's first institute dedicated solely to optometry education." },
  { year: "2013", text: "The college moves to a new building exclusively for academics, with an optics lab, demonstration rooms, a conference hall and library." },
];


const IMG = {
  overview: "/Nethradhama.png",
  about: "/optometry.png",
  history: "/college.avif",
  facilities: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&w=1000&q=80",
};


export default function Page() {
  const active = useScrollSpy(SECTION_IDS);

  const [heroL1, heroL1Y] = useParallax(0.24);
  const [heroL2, heroL2Y] = useParallax(0.15);
  const [resLens, resLensY] = useParallax(0.14, 60);
  const [facLens, facLensY] = useParallax(0.18);

  return (
    <div className="min-h-screen scroll-smooth bg-stone-50  text-slate-700 antialiased selection:bg-[#0D8DD7]">
      <ScrollProgress />

   
      <section className="relative overflow-hidden">
        <div ref={heroL1} style={{ transform: `translateY(${heroL1Y}px)` }} className="pointer-events-none absolute -right-16 -top-12 will-change-transform">
          <Lens className="h-72 w-72 text-[#0D8DD7]/50" />
        </div>
        <div ref={heroL2} style={{ transform: `translateY(${heroL2Y}px)` }} className="pointer-events-none absolute -bottom-24 -left-24 will-change-transform">
          <Lens className="h-80 w-80 text-amber-200/50" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <Reveal className="max-w-3xl">
         
            <h1 className="mt-5  text-4xl font-semibold leading-[1.08] text-slate-900 sm:text-5xl lg:text-6xl">
              A college built entirely
              <br />
              <span className="text-[#0D8DD7]">around the eye.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Established in 2010 as Bangalore's first institute dedicated solely to optometry a unit of the Nethradhama Education &amp; Research Foundation, affiliated to RGUHS and recognised by the Government of Karnataka.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-12 flex flex-wrap gap-10 border-t border-stone-200 pt-8 sm:gap-16">
              <Stat to={15} suffix="+" label="Years of journey" />
              <Stat to={4} suffix=" yr" label="B.Sc. Optometry" />
              <Stat to={8} label="Supportive depts" />
            </div>
          </Reveal>
        </div>
      </section>

     
      <div className="sticky top-0 z-40 border-y border-stone-200 bg-stone-50/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active === s.id ? "bg-[#0D8DD7] text-white" : "text-slate-600 hover:bg-stone-200/70 hover:text-slate-900"
              }`}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>

     
      <section id="overview" className="scroll-mt-24 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2">
          <Reveal>
            <Eyebrow>Overview</Eyebrow>
            <h2 className="mt-4  text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              Welcome to Nethradhama School of Optometry.
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-slate-600">
              <p>
                Optometry is a unique primary eye-care profession offering a wide range of interesting, rewarding and challenging careers. As part of the Nethradhama Education &amp; Research Foundation, NSO is dedicated to delivering knowledge of the highest standard in the field.
              </p>
              <p>
                NSO is a full-time member of the Association of Schools and Colleges of Optometry (ASCO) and a resource centre for the International Association of Contact Lens Educators (IACLE). It is the first optometry college in Karnataka recognised by the Government of Karnataka and affiliated to RGUHS.
              </p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <ParallaxImage src={IMG.overview} alt="Clinical training at NSO" className="h-[400px] w-[500px] px-16 ml-auto" />
          </Reveal>
        </div>
      </section>

     
      <section id="about" className="scroll-mt-24 bg-stone-50">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2">
          <Reveal className="md:order-2">
            <Eyebrow>About NSO</Eyebrow>
            <h2 className="mt-4  text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              Karnataka's leading optometry college.
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-slate-600">
              <p>
                Run by Nethradhama Super Speciality Eye Hospital, Bangalore a centre of excellence in eye care NSO offers a four-year professional B.Sc. Optometry degree with continual upgradation of technology.
              </p>
              <p>
                Optometrists are primary eye-care practitioners: they measure refractive errors, prescribe glasses, contact lenses and low-vision aids, detect and manage conditions of the visual system, and provide non-surgical intervention for binocular vision problems such as squint.
              </p>
            </div>
          </Reveal>
          <Reveal delay={150} className="md:order-1">
            <ParallaxImage src={IMG.about} alt="Refraction practice" className="h-[400px] w-[450px] px-16 mr-auto" />
          </Reveal>
        </div>
      </section>

      
      <section id="history" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <Reveal>
              <Eyebrow>History</Eyebrow>
              <h2 className="mt-4  text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
                A decade of building eye-care talent.
              </h2>
              <div className="mt-8 space-y-6 border-l border-stone-200 pl-6">
                {history.map((h) => (
                  <div key={h.year} className="relative">
                    <span className="absolute -left-[31px] top-1 grid h-4 w-4 place-items-center rounded-full bg-[#0D8DD7] ring-4 ring-white" />
                    <div className=" text-xl font-semibold text-slate-900">{h.year}</div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{h.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={150}>
              <ParallaxImage src={IMG.history} alt="NSO campus" className="aspect-[4/3]" />
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="mt-14">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Under the leadership of</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {leadership.map((l) => (
                  <div key={l.name} className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#0D8DD7]/10  text-lg font-semibold text-[#0D8DD7]">
                      {l.name.split(" ").filter((w) => w !== "Dr.").map((w) => w[0]).join("")}
                    </span>
                    <div>
                      <div className=" font-semibold text-slate-900">{l.name}</div>
                      <div className="text-xs text-slate-500">{l.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

     
      <section id="facilities" className="relative scroll-mt-24 overflow-hidden bg-stone-50">
        <div ref={facLens} style={{ transform: `translateY(${facLensY}px)` }} className="pointer-events-none absolute -right-24 top-12 will-change-transform">
          <Lens className="h-72 w-72 text-[#0D8DD7]/10" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20">
          <Reveal className="max-w-2xl">
            <Eyebrow>Facilities</Eyebrow>
            <h2 className="mt-4  text-3xl font-semibold text-slate-900 sm:text-4xl">
              Everything a future optometrist needs.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-stone-200 bg-white px-5 py-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 font-medium text-[#0D8DD7]">{Icon.pin("h-4 w-4")} Jayanagar 7th Block, Bengaluru</span>
              <span className="text-stone-300">•</span>
              <span>7.5 km from City Railway Station</span>
              <span className="text-stone-300">•</span>
              <span>40 km from Kempegowda International Airport</span>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="group h-full rounded-2xl border border-stone-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#0D8DD7]/30 hover:shadow-xl hover:shadow-slate-900/5">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#0D8DD7]/10 text-[#0D8DD7] transition-colors group-hover:bg-[#0D8DD7] group-hover:text-white">
                    {f.icon("h-6 w-6")}
                  </div>
                  <h3 className="mt-5  text-xl font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <p className="mt-6 text-sm leading-relaxed text-slate-500">
              Clinical postings throughout the academic year are conducted at Nethradhama Super Speciality Eye Hospital, Jayanagar giving students real exposure across every branch of eye care.
            </p>
          </Reveal>
        </div>
      </section>

     
      <section id="departments" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="max-w-2xl">
            <Eyebrow>Supportive Departments</Eyebrow>
            <h2 className="mt-4  text-3xl font-semibold text-slate-900 sm:text-4xl">
              The teams that keep NSO running.
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {departments.map((d, i) => (
              <Reveal key={d} delay={i * 50}>
                <div className="flex h-full items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3.5 transition-colors hover:border-[#0D8DD7]/30">
                  <Lens className="h-4 w-4 shrink-0 text-[#0D8DD7]" />
                  <span className="text-sm font-medium text-slate-700">{d}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      
      <section id="academics" className="scroll-mt-24 bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="max-w-2xl">
            <Eyebrow>Academics</Eyebrow>
            <h2 className="mt-4  text-3xl font-semibold text-slate-900 sm:text-4xl">
              The B.Sc. Optometry program, in detail.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">
            {academics.map((a, i) => (
              <Reveal key={a.k} delay={i * 50} className="bg-white">
                <div className="h-full p-7">
                  <div className=" text-sm font-semibold uppercase tracking-wider text-[#0D8DD7]">{a.k}</div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{a.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

     
      <section id="research" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-[#0D8DD7] p-8 text-sky-50 sm:p-12">
              <div ref={resLens} style={{ transform: `translateY(${resLensY}px)` }} className="pointer-events-none absolute -right-12 -top-12 will-change-transform">
                <Lens className="h-60 w-60 text-white/15" />
              </div>
              <div className="relative max-w-3xl">
                <Eyebrow light>Research</Eyebrow>
                <p className="mt-4 text-lg leading-relaxed text-sky-50/90">
                  NSO is committed to continually strengthening its academic activities and research programs, backed by a comprehensive curriculum and high standards of training and clinical experience.
                </p>
                <p className="mt-6  text-xl leading-relaxed sm:text-2xl">
                  Our students Ms. Nikhita R Bhat, Ms. Pooja Kumari Sah and Mr. Anvith M Agumbe were selected for the RGUHS UG-AHS research grant for 2021–22.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

     
      <section id="admissions" className="scroll-mt-24 bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
              <div className="grid md:grid-cols-3">
                <div className="bg-slate-900 p-8 text-white sm:p-10">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                    </span>
                    Notice Board
                  </span>
                  <h2 className="mt-4  text-2xl font-semibold leading-tight sm:text-3xl">
                    Admissions open for B.Sc. Optometry 2025–26.
                  </h2>
                </div>
                <div className="grid gap-px bg-stone-200 p-px sm:grid-cols-2 md:col-span-2">
                  {[
                    ["Venue", "Nethradhama School of Optometry"],
                    ["Timing", "09:00 AM – 05:00 PM"],
                    ["Landline", "080-26716152"],
                    ["Mobile", "+91 77607 44990"],
                    ["Email", "optoschool@nethradhama.org"],
                    ["Apply", "Walk in or call to begin"],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-white p-6">
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#0D8DD7]">{k}</div>
                      <div className="mt-1 text-sm font-medium text-slate-800">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    
      <section id="brochure" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-[#0D8DD7]/20 bg-[#0D8DD7]/5 p-8 sm:flex-row sm:items-center sm:p-10">
              <div className="max-w-xl">
                <Eyebrow>Brochure</Eyebrow>
                <h2 className="mt-3  text-2xl font-semibold text-slate-900 sm:text-3xl">
                  Take the prospectus with you.
                </h2>
                <p className="mt-2 text-slate-600">
                  Course structure, eligibility, facilities and admission details all in one PDF.
                </p>
              </div>
              <a
                href="/brochure.pdf"
                download
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0D8DD7] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                {Icon.download("h-5 w-5")} Download brochure
              </a>
            </div>
          </Reveal>
        </div>
      </section>

     
      <section id="antiragging" className="scroll-mt-24 bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 pb-24">
          <Reveal>
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 sm:p-10">
              <Eyebrow>Anti-Ragging Cell</Eyebrow>
              <h2 className="mt-4  text-2xl font-semibold text-slate-900 sm:text-3xl">
                A campus that is safe, by commitment.
              </h2>
              <p className="mt-4 max-w-3xl text-slate-700">
                Ragging in all its forms is strictly prohibited at Nethradhama School of Optometry across every department, unit and premise in line with the Hon'ble Supreme Court of India, UGC guidelines and the Ragging Prohibition Act, 1999. We maintain an Anti-Ragging Committee, a monitoring cell, a squad panel and a student mentoring cell; collect affidavits from students and parents at admission; and display committee members' names and contacts on the notice board. Anyone found guilty of ragging or of abetting it, actively or passively is referred to the committee for necessary action.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">National Anti-Ragging Helpline (24×7)</div>
                  <a href="tel:18001805522" className="mt-1 block  text-2xl font-semibold text-slate-900">1800-180-5522</a>
                  <a href="mailto:helpline@antiragging.in" className="text-sm text-[#0D8DD7] hover:underline">helpline@antiragging.in</a>
                </div>
                <div className="rounded-2xl bg-white p-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">Chairperson, Anti-Ragging Cell</div>
                  <div className="mt-1  text-lg font-semibold text-slate-900">Dr. Savitha Arun</div>
                  <div className="text-sm text-slate-600">Principal NSO · 080-26716152</div>
                  <a href="mailto:optoschool@nethradhama.org" className="text-sm text-[#0D8DD7] hover:underline">optoschool@nethradhama.org</a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
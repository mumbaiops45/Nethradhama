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
      <div className="font-serif text-3xl font-semibold text-slate-900">
        {val}
        {suffix}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}


const events = [
  { title: "Orientation Day", date: null, desc: "Every year we welcome our incoming students with a warm orientation — an introduction to the campus, the faculty and the journey ahead.", photo: "/events/orientation-day.jpg", fallbackImg: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80" },
  { title: "National Youth Day", date: "12 Jan", desc: "Students mark Youth Day with posters and talks on the life and philosophy of Swami Vivekananda — part of NSO's holistic development environment.", photo: "/events/national-youth-day.jpg", fallbackImg: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80" },
  { title: "Annual Day", date: null, desc: "A day filled with entertainment and excitement that rocks the college and gives students a stage to unleash their talents.", photo: "/events/annual-day.jpg", fallbackImg: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80" },
  { title: "Sports & Cultural Week", date: null, desc: "A wide range of sporting, recreational and cultural activities — with something for everyone.", photo: "/events/sports-cultural-week.jpg", fallbackImg: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80" },
  { title: "Republic & Independence Day", date: "26 Jan · 15 Aug", desc: "We celebrate every national festival together, breaking barriers of community and glorifying the spirit of unity.", photo: "/events/republic-independence-day.jpg", fallbackImg: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80" },
  { title: "World Optometry Day", date: "23 Mar", desc: "Marked with poster presentations, rangoli and essay competitions — plus public-awareness drives like road plays and talks in schools and colleges.", photo: "/events/world-optometry-day.jpg", fallbackImg: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1200&q=80" },
  { title: "Farewell Function", date: null, desc: "Each year a farewell function is held to bid a fond adieu to our graduating final-year students.", photo: "/events/farewell-function.jpg", fallbackImg: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80" },
  { title: "National Cleanliness Day", date: null, desc: "Students take part in cleanliness drives, championing tidy and healthy public spaces on and around the campus.", photo: "/events/national-cleanliness-day.jpg", fallbackImg: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1200&q=80" },
  { title: "Educational & Recreational Trips", date: null, desc: "Yearly trips that broaden students' knowledge and build bonds well beyond the classroom.", photo: "/events/educational-trips.jpg", fallbackImg: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80" },
];


function EventCard({ e, i }) {
  const [step, setStep] = useState(0);
  const [pref, py] = useParallax(0.06, 14);
  const candidates = [e.photo, e.fallbackImg].filter(Boolean);
  const src = candidates[step];
  const showImg = !!src;
  return (
    <Reveal delay={(i % 3) * 80}>
      <article className="group h-full overflow-hidden rounded-3xl border border-stone-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          {showImg ? (
            <div ref={pref} className="absolute inset-0 will-change-transform" style={{ transform: `translateY(${py}px)` }}>
              <img
                key={src}
                src={src}
                alt={e.title}
                loading="lazy"
                onError={() => setStep((s) => s + 1)}
                className="h-full w-full scale-110 object-cover transition-transform duration-700 ease-out group-hover:scale-125"
              />
            </div>
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#0D8DD7]/15 via-sky-50 to-amber-100">
              <Lens className="h-20 w-20 text-[#0D8DD7]/40 transition-transform duration-500 group-hover:scale-110" />
            </div>
          )}
          {e.date && (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0D8DD7] backdrop-blur-sm">
              {e.date}
            </span>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/15 to-transparent" />
        </div>
        <div className="p-6">
          <h3 className="font-serif text-xl font-semibold text-slate-900">{e.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{e.desc}</p>
        </div>
      </article>
    </Reveal>
  );
}

export default function Page() {
  const [heroL1, heroL1Y] = useParallax(0.24);
  const [heroL2, heroL2Y] = useParallax(0.15);
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

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <Reveal className="max-w-3xl">
            <Eyebrow>Student Life</Eyebrow>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] text-slate-900 sm:text-5xl lg:text-6xl">
              More than a classroom —
              <br />
              <span className="text-[#0D8DD7]">a whole experience.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              NSO offers a holistic environment where academics meet celebration, service and play. From national festivals to World Optometry Day, here's a year in the life of our students.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-12 flex flex-wrap gap-10 border-t border-stone-200 pt-8 sm:gap-16">
              <Stat to={9} suffix="+" label="Signature events" />
              <Stat to={23} label="World Optometry Day (Mar)" />
              <Stat to={1} suffix=" yr" label="Trips every year" />
            </div>
          </Reveal>
        </div>
      </section>

    
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="max-w-2xl">
            <Eyebrow>Events &amp; Activities</Eyebrow>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
              A year, in full colour.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e, i) => (
              <EventCard key={e.title} e={e} i={i} />
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
                  <Eyebrow light>Join us</Eyebrow>
                  <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight sm:text-3xl">
                    Be part of the NSO story.
                  </h2>
                  <p className="mt-2 text-sky-50/90">
                    Admissions for 2025–26 are open. Come learn, celebrate and grow with us.
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
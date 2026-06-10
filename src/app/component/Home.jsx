
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
            ([entry]) => {
                if (entry.isIntersecting) {
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
        let raf, startTime;
        const tick = (t) => {
            if (!startTime) startTime = t;
            const p = Math.min((t - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(eased * to));
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
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);
    return (
        <div className="fixed left-0 top-0 z-50 h-1 w-full bg-transparent">
            <div
                className="h-full bg-[#0D8DD7] transition-[width] duration-150 ease-out"
                style={{ width: `${p}%` }}
            />
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
            <span className={light ? "text-emerald-200" : "text-emerald-700"}>{children}</span>
        </span>
    );
}


function Stat({ to, suffix, label }) {
    const [ref, shown] = useReveal();
    const val = useCountUp(to, shown);
    return (
        <div ref={ref}>
            <div className="font-serif text-2xl font-semibold text-slate-900">
                {val}
                {suffix}
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
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
    clinic: (c) => (
        <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
            <path d="M3 21h18M5 21V7l7-4 7 4v14" strokeLinejoin="round" />
            <path d="M12 9v6M9 12h6" strokeLinecap="round" />
        </svg>
    ),
    flask: (c) => (
        <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
            <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" strokeLinejoin="round" />
            <path d="M7.5 15h9" strokeLinecap="round" />
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
    community: (c) => (
        <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
            <circle cx="8" cy="9" r="3" />
            <circle cx="17" cy="10" r="2.5" />
            <path d="M2 20a6 6 0 0 1 12 0M14.5 20a5 5 0 0 1 7.5-4.3" strokeLinecap="round" />
        </svg>
    ),
};

const services = [
    { icon: Icon.eye, title: "Comprehensive Eye Care", desc: "Hands-on training in refraction, ocular diagnostics and primary vision care across all age groups." },
    { icon: Icon.clinic, title: "Clinical Internship", desc: "A compulsory one-year internship at Nethradhama Super Speciality Eye Hospital." },
    { icon: Icon.flask, title: "Research Programs", desc: "UG research projects supported by RGUHS grants, building a strong evidence-based foundation." },
    { icon: Icon.lens, title: "Contact Lens & Low Vision", desc: "Specialty clinics in contact lens fitting, low-vision aids and visual rehabilitation." },
    { icon: Icon.child, title: "Pediatric & Binocular Vision", desc: "Focused modules on children's vision, squint evaluation and binocular vision therapy." },
    { icon: Icon.community, title: "Community Outreach", desc: "Vision-screening camps that take eye care to schools and underserved communities." },
];

const gallery = [
    { src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80", label: "Clinical Skills" },
    { src: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=800&q=80", label: "Refraction Lab" },
    { src: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&w=800&q=80", label: "Diagnostics" },
    { src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80", label: "Eye Examination" },
    { src: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80", label: "Research" },
    { src: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=800&q=80", label: "Campus Life" },
    { src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80", label: "Eye Examination" },
    { src: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80", label: "Research" },
];

const academics = [
    { k: "Program Offered", v: "4-year B.Sc. in Optometry affiliated with RGUHS, Karnataka — three academic years followed by one year of compulsory internship." },
    { k: "Eligibility", v: "50% aggregate in English, Physics, Chemistry and Biology/Mathematics at 10+2. Diploma holders may join directly in the second year." },
    { k: "Selection", v: "Based on 10+2 marks, a written test and performance in a personal interview." },
    { k: "Academic Session", v: "The course begins every August — a full-time program of theory, practical and clinical sessions." },
    { k: "Evaluation", v: "Three internal assessments plus a term-end exam each year, with equal weightage. A minimum of 50% in the term-end exam is required." },
    { k: "Medium of Instruction", v: "All theory and practical instruction and examinations are conducted in English." },
];

const faqs = [
    { q: "What is the eligibility for B.Sc. Optometry?", a: "Candidates must have scored at least 50% taken together in English, Physics, Chemistry and Biology/Mathematics in their 10+2 (higher secondary) examination." },
    { q: "Can diploma holders get direct admission?", a: "Yes. Candidates who have completed a 2–3 year diploma in optometry can take lateral-entry admission directly into the second year of the B.Sc. Optometry program." },
    { q: "How is selection done?", a: "Selection is based on your 10+2 marks, a written test, and your performance in a personal interview." },
    { q: "When does the course begin?", a: "The course commences in August every year. It is a full-time program combining theory, practical and clinical sessions." },
    { q: "What is the total course duration?", a: "Four years in total — three academic years followed by one year of compulsory internship, after which you are awarded the B.Sc. degree in Optometry." },
    { q: "What is the medium of instruction?", a: "English. Both theory and practical instruction are in English, and examinations must be written in English." },
    { q: "Is the college recognised?", a: "Yes, the program is affiliated with Rajiv Gandhi University of Health Sciences (RGUHS), Karnataka. Students have secured university ranks in RGUHS examinations." },
];

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-stone-200">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-6  px-5 py-5 text-left group"
                aria-expanded={open}
            >
                <span className="text-base  font-medium text-slate-900 group-hover:text-[#0D8DD7] transition-colors">
                    {q}
                </span>
                <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-stone-300 text-lg leading-none text-[#0D8DD7] transition-transform duration-300 ${open ? "rotate-45 bg-[#0D8DD7] border-[#0D8DD7] text-white" : ""
                        }`}
                >
                    +
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <p className="pb-5 px-5 pr-12 text-sm leading-relaxed text-slate-600">{a}</p>
            </div>
        </div>
    );
}


function GalleryCard({ item, index, featured }) {
    const [pref, py] = useParallax(0.08, 12);
    return (
        <Reveal delay={index * 70} className={featured ? "col-span-2 md:col-span-1 md:row-span-2" : ""}>
            <div
                className={`group relative h-full overflow-hidden rounded-2xl bg-slate-200 ${featured ? "min-h-[16rem] md:min-h-full" : "aspect-[4/3]"
                    }`}
            >
                <div ref={pref} className="absolute inset-0" style={{ transform: `translateY(${py}px)` }}>
                    <img
                        src={item.src}
                        alt={item.label}
                        loading="lazy"
                        className="h-full w-full scale-110 object-cover transition-transform duration-700 ease-out group-hover:scale-125"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/0 to-transparent" />
                <span className="absolute bottom-4 left-4 text-sm font-medium text-white">{item.label}</span>
            </div>
        </Reveal>
    );
}

export default function Home() {

    const [heroLens1, heroLens1Y] = useParallax(0.25);
    const [heroLens2, heroLens2Y] = useParallax(0.16);
    const [heroCard, heroCardY] = useParallax(0.06, 26);
    const [servicesLens, servicesLensY] = useParallax(0.2);
    const [academicsLens, academicsLensY] = useParallax(0.18);
    const [researchLens, researchLensY] = useParallax(0.14, 60);
    const [galleryLens, galleryLensY] = useParallax(0.18);
    const [faqLens, faqLensY] = useParallax(0.16);

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-slate-700 antialiased selection:bg-[#0D8DD7]">
            <ScrollProgress />

            <section className="relative overflow-hidden">

                <div
                    ref={heroLens1}
                    style={{ transform: `translateY(${heroLens1Y}px)` }}
                    className="pointer-events-none absolute -right-16 -top-10 will-change-transform"
                >
                    <Lens className="h-72 w-72 text-[#0D8DD7]/60" />
                </div>
                <div
                    ref={heroLens2}
                    style={{ transform: `translateY(${heroLens2Y}px)` }}
                    className="pointer-events-none absolute -bottom-24 -left-20 will-change-transform"
                >
                    <Lens className="h-80 w-80 text-amber-200/50" />
                </div>

                <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-16">
                    <Reveal>
                        <Eyebrow>Bengaluru · Affiliated to RGUHS</Eyebrow>
                        <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.1] text-slate-900 sm:text-5xl lg:text-6xl">
                            Bring the world
                            <br />
                            <span className="text-[#0D8DD7]">into focus.</span>
                        </h1>
                        <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600">
                            A four-year B.Sc. in Optometry built on rigorous academics, real clinical exposure and research — shaping the eye-care professionals of tomorrow.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <a href="#contact" className="rounded-full bg-[#0D8DD7] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                                Apply for 2025–26
                            </a>
                            <a href="#academics" className="rounded-full border border-stone-300 px-7 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-[#0D8DD7] hover:text-[#0D8DD7]">
                                Explore the program
                            </a>
                        </div>
                        <div className="mt-10 flex gap-8 border-t border-stone-200 pt-6">
                            <Stat to={4} suffix=" yrs" label="Full program" />
                            <Stat to={1} suffix=" yr" label="Internship" />
                            <Stat to={100} suffix="%" label="English medium" />
                        </div>
                    </Reveal>

                    <Reveal delay={150}>
                        <div className="relative mx-auto w-full max-w-[620px]  " >
                            <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-[#0D8DD7]/20 blur-3xl" />
                            <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />
                            <div className="relative overflow-hidden rounded-[32px] border border-white/40 bg-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.12)] backdrop-blur-sm">
                                <img src="/hero.png"
                                    alt="Optometry Student"
                                    className="h-[420px] w-full object-cover object-center sm:h-[500px] lg:h-[620px]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-white/10" />

                                <div className="absolute bottom-6 left-6 rounded-2xl border border-white/30 bg-white/90 px-5 py-3 shadow-xl backdrop-blur">
                                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Clinical Excellence</p>
                                    <p className="mt-1 text-lg font-semibold text-slate-900">Hands-on Training</p>

                                </div>
                            </div>

                        </div>
                    </Reveal>
                </div>
            </section>

           
            <section
                id="about"
                className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50"
            >
               
                <div className="absolute top-20 left-0 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />

                <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
                    <div className="grid items-center gap-16 lg:grid-cols-2">

                       
                        <Reveal>
                            <div className="max-w-xl">
                                <Eyebrow>About Us</Eyebrow>

                                <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight text-slate-900 lg:text-5xl">
                                    A commitment to
                                    <span className="block text-[#0D8DD7]">
                                        clear vision and clearer minds.
                                    </span>
                                </h2>

                                <p className="mt-8 text-lg leading-relaxed text-slate-600">
                                    Nethradhama School of Optometry is committed to continually
                                    strengthening its academic and research programs. We take pride
                                    in providing high standards of education, training, and
                                    clinical experience.
                                </p>

                                <p className="mt-5 text-lg leading-relaxed text-slate-600">
                                    With a comprehensive curriculum and a teaching hospital at its
                                    core, NSO prepares students to become confident, ethical, and
                                    skilled optometrists — ready to serve patients from their very
                                    first clinical posting.
                                </p>

                               
                                <div className="mt-10 grid grid-cols-3 gap-6 border-t border-slate-200 pt-8">
                                    <div>
                                        <h3 className="text-3xl font-bold text-[#0D8DD7]">20+</h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Years of Excellence
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-3xl font-bold text-[#0D8DD7]">100%</h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Clinical Exposure
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-3xl font-bold text-[#0D8DD7]">4+1</h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Program Structure
                                        </p>
                                    </div>
                                </div>

                               
                                <div className="mt-10">
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center rounded-full bg-[#0D8DD7] px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </Reveal>

                        {/* RIGHT IMAGE */}
                        <Reveal delay={150}>
                            <div className="relative mx-auto w-full max-w-[600px]">

                                {/* Decorative Shape */}
                                <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-[#0D8DD7]/20 blur-2xl" />

                                {/* Main Image */}
                                <div
                                    className="
              group
              relative
              overflow-hidden
              rounded-[32px]
              border border-white/50
              bg-white
              shadow-[0_30px_100px_rgba(15,23,42,0.12)]
              transition-all
              duration-700
              hover:-translate-y-2
              hover:shadow-[0_40px_120px_rgba(15,23,42,0.18)]
            "
                                >
                                    <img
                                        src="/about.jpeg"
                                        alt="Students learning optometry"
                                        className="
                h-[420px]
                w-full
                object-cover
                transition-transform
                duration-700
                group-hover:scale-105
                sm:h-[500px]
                lg:h-[620px]
              "
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-white/10" />

                                    {/* Floating Card */}
                                    <div
                                        className="
                absolute
                bottom-6
                left-6
                rounded-2xl
                bg-white/90
                px-5
                py-4
                shadow-xl
                backdrop-blur
                transition-all
                duration-500
                group-hover:-translate-y-1
              "
                                    >
                                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Excellence in Education
                                        </p>

                                        <p className="mt-1 text-lg font-semibold text-slate-900">
                                            Future Optometrists
                                        </p>
                                    </div>
                                </div>

                                {/* Floating Experience Badge */}
                                <div
                                    className="
              absolute
              -left-8
              top-10
              hidden
              rounded-2xl
              bg-white
              p-5
              shadow-xl
              lg:block
              animate-bounce
            "
                                >
                                    <h3 className="text-2xl font-bold text-[#0D8DD7]">
                                        20+
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Years Experience
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>


            <section id="services" className="relative overflow-hidden bg-stone-50">
                <div
                    ref={servicesLens}
                    style={{ transform: `translateY(${servicesLensY}px)` }}
                    className="pointer-events-none absolute -right-24 top-10 will-change-transform"
                >
                    <Lens className="h-72 w-72 text-[#0D8DD7]/10" />
                </div>
                <div className="relative mx-auto max-w-6xl px-4 py-20">
                    <Reveal className="max-w-2xl">
                        <Eyebrow>What we offer</Eyebrow>
                        <h2 className="mt-4 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
                            Training that spans the whole of eye care.
                        </h2>
                    </Reveal>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((s, i) => (
                            <Reveal key={s.title} delay={i * 80}>
                                <div className="group h-full rounded-2xl border border-stone-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#0D8DD7]/30 hover:shadow-xl hover:shadow-emerald-900/5">
                                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#0D8DD7]/10 text-[#0D8DD7] transition-colors group-hover:bg-[#0D8DD7] group-hover:text-white">
                                        {s.icon("h-6 w-6")}
                                    </div>
                                    <h3 className="mt-5 font-serif text-xl font-semibold text-slate-900">{s.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>


            <section
                id="academics"
                className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50"
            >

                <div
                    ref={academicsLens}
                    style={{ transform: `translateY(${academicsLensY}px)` }}
                    className="pointer-events-none absolute -left-20 top-20 opacity-70"
                >
                    <Lens className="h-72 w-72 text-[#0D8DD7]/10" />
                </div>

                <div className="relative  max-w-7xl  py-24 lg:px-8">


                    <Reveal>
                        <div className="text-start px-14 max-w-3xl text-center">
                            <Eyebrow>Academics</Eyebrow>

                            <h2 className="mt-5 font-serif text-4xl font-semibold text-slate-900 sm:text-5xl">
                                The B.Sc. Optometry Program
                            </h2>

                            <p className="mt-6 text-lg leading-relaxed text-slate-600">
                                A carefully structured curriculum combining classroom learning,
                                clinical exposure, research opportunities, and professional
                                development to prepare future optometrists.
                            </p>
                        </div>
                    </Reveal>

                    <div className="mt-16 grid gap-6 px-14 md:grid-cols-2 xl:grid-cols-3">
                        {academics.map((a, i) => (
                            <Reveal key={a.k} delay={i * 80}>
                                <div
                                    className="
              group
              h-full
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-8
              shadow-sm
              transition-all
              duration-500
              hover:-translate-y-2
              hover:border-[#0D8DD7]/30
              hover:shadow-2xl
            "
                                >

                                    <div className="mb-6 h-1 w-14 rounded-full bg-[#0D8DD7]" />

                                    <h3 className="font-serif text-xl font-semibold text-slate-900">
                                        {a.k}
                                    </h3>

                                    <p className="mt-4 leading-relaxed text-slate-600">
                                        {a.v}
                                    </p>

                                    <div
                                        className="
                mt-6
                h-px
                bg-slate-100
                transition-all
                duration-500
                group-hover:bg-[#0D8DD7]/30
              "
                                    />
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal delay={150}>
                        <div className="relative mt-20 overflow-hidden rounded-[32px] bg-[#0D8DD7] p-10 shadow-[0_25px_80px_rgba(13,141,215,0.25)] lg:p-14">
                            <div
                                ref={researchLens}
                                style={{ transform: `translateY(${researchLensY}px)` }}
                                className="absolute -right-10 -top-10 opacity-40"
                            >
                                <Lens className="h-60 w-60 text-white/20" />
                            </div>


                            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

                            <div className="relative z-10">
                                <Eyebrow light>Research Achievement</Eyebrow>

                                <h3 className="mt-4 font-serif text-3xl font-semibold text-white">
                                    Recognized Research Excellence
                                </h3>

                                <p className="mt-6 max-w-4xl text-lg leading-relaxed text-blue-50">
                                    Our students
                                    <span className="font-semibold text-white">
                                        {" "}Ms. Nikhita R Bhat,
                                        Ms. Pooja Kumari Sah,
                                        and Mr. Anvith M Agumbe
                                    </span>
                                    {" "}were selected for the prestigious
                                    <span className="font-semibold text-white">
                                        {" "}RGUHS UG-AHS Research Grant
                                    </span>
                                    {" "}for the academic year 2021–22, highlighting the
                                    institution's strong emphasis on innovation,
                                    scientific inquiry, and evidence-based practice.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <div className="rounded-full bg-white/15 px-5 py-2 text-sm font-medium text-white backdrop-blur">
                                        Research Driven
                                    </div>

                                    <div className="rounded-full bg-white/15 px-5 py-2 text-sm font-medium text-white backdrop-blur">
                                        RGUHS Recognition
                                    </div>

                                    <div className="rounded-full bg-white/15 px-5 py-2 text-sm font-medium text-white backdrop-blur">
                                        Student Innovation
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>


            <section id="gallery" className="relative overflow-hidden bg-stone-50">
                <div
                    ref={galleryLens}
                    style={{ transform: `translateY(${galleryLensY}px)` }}
                    className="pointer-events-none absolute -right-24 bottom-10 will-change-transform"
                >
                    <Lens className="h-72 w-72 text-[#0D8DD7]/10" />
                </div>
                <div className="relative mx-auto max-w-6xl px-4 py-20">
                    <Reveal className="max-w-2xl">
                        <Eyebrow>Gallery</Eyebrow>
                        <h2 className="mt-4 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
                            Life and learning at NSO.
                        </h2>
                    </Reveal>
                    <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
                        {gallery.map((g, i) => (
                            <GalleryCard key={g.label} item={g} index={i} featured={i === 0} />
                        ))}
                    </div>
                </div>
            </section>


            {/* <section id="faq" className="relative overflow-hidden bg-white">
                <div
                    ref={faqLens}
                    style={{ transform: `translateY(${faqLensY}px)` }}
                    className="pointer-events-none absolute -left-24 top-16 will-change-transform"
                >
                    <Lens className="h-72 w-72 text-amber-300/10" />
                </div>
                <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-12">
                    <Reveal className="md:col-span-4">
                        <Eyebrow>FAQ</Eyebrow>
                        <h2 className="mt-4 font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
                            Questions, answered.
                        </h2>
                        <p className="mt-4 text-slate-600">
                            Couldn't find what you're looking for? Reach the administrator at{" "}
                            <a href="tel:+917760744990" className="font-medium text-[#0D8DD7] hover:underline">+91 77607 44990</a>.
                        </p>
                    </Reveal>
                    <Reveal delay={120} className="md:col-span-8">
                        <div className="rounded-2xl border border-stone-200 bg-stone-50 px-6">
                            {faqs.map((f) => (
                                <FaqItem key={f.q} q={f.q} a={f.a} />
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section> */}

           <section
  id="faq"
  className="relative bg-gradient-to-b from-white via-slate-50/40 to-white"
>
 
  <div
    ref={faqLens}
    style={{ transform: `translateY(${faqLensY}px)` }}
    className="pointer-events-none absolute left-0 top-20 opacity-50"
  >
    <Lens className="h-80 w-80 text-[#0D8DD7]/10" />
  </div>

 
  <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl" />

  <div className="relative mx-auto max-w-7xl px-6 py-28">
    <div className="grid items-start gap-20 lg:grid-cols-[0.9fr_1.1fr]">

      {/* LEFT CONTENT */}
      <div className="lg:sticky lg:top-28">
        <Reveal>
          <div className="max-w-md">
            <Eyebrow>Frequently Asked Questions</Eyebrow>

            <h2 className="mt-5 font-serif text-5xl font-semibold leading-tight text-slate-900">
              Questions,
              <span className="block text-[#0D8DD7]">
                Answered.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Everything you need to know about admissions,
              academics, internships, eligibility, fees and
              student life at Nethradhama School of Optometry.
            </p>

            {/* Contact Card */}
            <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-100">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Need Assistance?
              </p>

              <a
                href="tel:+917760744990"
                className="mt-3 block text-3xl font-bold text-[#0D8DD7] transition-all duration-300 hover:text-sky-600"
              >
                +91 77607 44990
              </a>

              <p className="mt-3 text-slate-500">
                Speak directly with our admissions team.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white p-5 shadow-md shadow-slate-100">
                <h3 className="text-3xl font-bold text-[#0D8DD7]">
                  4+1
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Program Structure
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-md shadow-slate-100">
                <h3 className="text-3xl font-bold text-[#0D8DD7]">
                  100%
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Clinical Exposure
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* RIGHT FAQS */}
      <div className="relative">
        <Reveal delay={150}>
          <div className="space-y-6">
            {faqs.map((f, index) => (
              <div
                key={f.q}
                className="
                  group
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  transition-all
                  duration-500
                  hover:-translate-y-1
                  hover:border-[#0D8DD7]/30
                  hover:shadow-xl
                  hover:shadow-sky-100
                "
              >
                <FaqItem q={f.q} a={f.a} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </div>
</section>


            <section className="bg-stone-50">
                <div className="mx-auto max-w-6xl px-4 pb-20">
                    <Reveal>
                        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 sm:p-10">
                            <Eyebrow>Anti-Ragging Cell</Eyebrow>
                            <h2 className="mt-4 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
                                A campus that is safe, by commitment.
                            </h2>
                            <p className="mt-4 max-w-3xl text-slate-700">
                                Ragging in all its forms is strictly prohibited at Nethradhama School of Optometry, in line with the directives of the Hon'ble Supreme Court of India, UGC guidelines and the Ragging Prohibition Act, 1999. We maintain an Anti-Ragging Committee, a monitoring cell, a squad panel and a student mentoring cell, and collect affidavits from students and parents at admission. Anyone found guilty of ragging — or of abetting it — is referred to the committee for action.
                            </p>
                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl bg-white p-6">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">National Anti-Ragging Helpline (24×7)</div>
                                    <a href="tel:18001805522" className="mt-1 block font-serif text-2xl font-semibold text-slate-900">1800-180-5522</a>
                                    <a href="mailto:helpline@antiragging.in" className="text-sm text-[#0D8DD7] hover:underline">helpline@antiragging.in</a>
                                </div>
                                <div className="rounded-2xl bg-white p-6">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">Chairperson, Anti-Ragging Cell</div>
                                    <div className="mt-1 font-serif text-lg font-semibold text-slate-900">Dr. Savitha Arun</div>
                                    <div className="text-sm text-slate-600">Principal — NSO · 080-26716152</div>
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
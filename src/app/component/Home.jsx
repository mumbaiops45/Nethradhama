
"use client"
import React, { useState, useEffect, useRef } from "react";
import Whatwe from "./Whatwe";
import Link from "next/link";
import { motion } from "framer-motion";

const heroImages = [
    "/hero.png",
    "/hero1.jpg",
    "/hero2.jpg",
];

function useReveal() {
    const ref = useRef(null);
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
        if (reduce) { setShown(true); return; }
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) { setShown(true); io.unobserve(el); }
            },
            { threshold: 0.15 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return [ref, shown];
}


export const FadeUp = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
            duration: 0.8,
            delay: delay / 1000,
            ease: [0.22, 1, 0.36, 1]
        }}
    >
        {children}
    </motion.div>
);

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
        <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em]">
            <span className={`h-px w-8 ${light ? "bg-sky-200" : "bg-[#0D8DD7]"}`} />
            <span className={light ? "text-sky-100" : "text-[#0D8DD7]"}>{children}</span>
        </span>
    );
}



const gallery = [
    { src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80", label: "Clinical Skills" },
    { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80", label: "Refraction Lab" },
    { src: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&w=800&q=80", label: "Diagnostics" },
    { src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80", label: "Eye Examination" },
    { src: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80", label: "Research" },
    { src: "/collegelife.jpg", label: "Campus Life" },
    { src: "https://images.unsplash.com/photo-1579165466949-3180a3d056d5?auto=format&fit=crop&w=800&q=80", label: "Optical Lab" },
    { src: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80", label: "Lecture Hall" },
];

const academics = [
    { k: "Program Offered", v: "4-year B.Sc. in Optometry affiliated with RGUHS, Karnataka three academic years followed by one year of compulsory internship.", img: "/Program.jpeg" },
    { k: "Eligibility", v: "50% aggregate in English, Physics, Chemistry and Biology/Mathematics at 10+2. Diploma holders may join directly in the second year.", img: "/Community.png" },
    { k: "Selection", v: "Based on 10+2 marks, a written test and performance in a personal interview.", img: "/Selection.jpg" },
    { k: "Academic Session", v: "The course begins every August a full-time program of theory, practical and clinical sessions.", img: "/AcademicSession.jpg" },
    { k: "Evaluation", v: "Three internal assessments plus a term-end exam each year, with equal weightage. A minimum of 50% in the term-end exam is required.", img: "/Exam.jpg" },
    { k: "Medium of Instruction", v: "All theory and practical instruction and examinations are conducted in English.", img: "/Instruction.png" },
];

const faqs = [
    { q: "What is the eligibility for B.Sc. Optometry?", a: "Candidates must have scored at least 50% taken together in English, Physics, Chemistry and Biology/Mathematics in their 10+2 (higher secondary) examination." },
    { q: "Can diploma holders get direct admission?", a: "Yes. Candidates who have completed a 2–3 year diploma in optometry can take lateral-entry admission directly into the second year of the B.Sc. Optometry program." },
    { q: "How is selection done?", a: "Selection is based on your 10+2 marks, a written test, and your performance in a personal interview." },
    { q: "When does the course begin?", a: "The course commences in August every year. It is a full-time program combining theory, practical and clinical sessions." },
    { q: "What is the total course duration?", a: "Four years in total three academic years followed by one year of compulsory internship, after which you are awarded the B.Sc. degree in Optometry." },
    { q: "What is the medium of instruction?", a: "English. Both theory and practical instruction are in English, and examinations must be written in English." },
    { q: "Is the college recognised?", a: "Yes, the program is affiliated with Rajiv Gandhi University of Health Sciences (RGUHS), Karnataka. Students have secured university ranks in RGUHS examinations." },
];

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left group"
                aria-expanded={open}
            >
                <span className="text-base font-medium text-slate-900 group-hover:text-[#0D8DD7] transition-colors">
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

        <Reveal delay={index * 70} className={featured ? "col-span-1 sm:col-span-2 md:col-span-1 md:row-span-2" : ""} >
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
    const [academicsLens, academicsLensY] = useParallax(0.18);
    const [researchLens, researchLensY] = useParallax(0.14, 60);
    const [galleryLens, galleryLensY] = useParallax(0.18);
    const [faqLens, faqLensY] = useParallax(0.16);
    const [currentImage, setCurrentImage] = useState(0);
    const [showContent, setShowContent] = useState(false);


    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);



    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <div className=" text-slate-700 antialiased selection:bg-[#0D8DD7] ">

            <ScrollProgress />

            <section className="relative min-h-screen bg-white md:h-screen overflow-hidden">


                <div className="absolute inset-0 hidden md:block">
                    {heroImages.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-[2500ms] ease-out ${currentImage === index ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <img
                                src={image}
                                alt=""
                                className="h-full w-full object-cover animate-kenburn"
                            />
                        </div>
                    ))}

                    <div className="absolute inset-0 bg-black/55" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>


                <div className="hidden md:block absolute left-[-150px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-sky-500/20 blur-[150px]" />


                <div className="relative z-10 flex h-full items-start md:items-center pt-10 md:pt-0">
                    <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">

                        <div className="max-w-2xl text-center md:text-left">

                            <p
                                className={`uppercase tracking-[5px] text-sm text-gray-600 md:text-white/70 transition-all duration-700 ${showContent
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-10"
                                    }`}
                            >
                                Bengaluru Affiliated to RGUHS
                            </p>


                            <h1
                                className={`mt-5 text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-gray-900 md:text-white transition-all duration-1000 delay-200 ${showContent
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-12"
                                    }`}
                            >
                                Bring the world
                                <br />
                                <span className="text-sky-500 md:text-sky-400">
                                    into focus.
                                </span>
                            </h1>


                            <p
                                className={`mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-gray-600 md:text-white/80 transition-all duration-1000 delay-500 ${showContent
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-12"
                                    }`}
                            >
                                A four-year B.Sc. in Optometry built on rigorous academics,
                                clinical excellence, research innovation, and hands-on patient care shaping tomorrow's eye-care professionals.
                            </p>

                            <div
                                className={`mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start transition-all duration-1000 delay-700 ${showContent
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-12"
                                    }`}
                            >
                                <a
                                    href="/contact"
                                    className="group rounded-full bg-sky-500 px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-sky-500/30 transition-all duration-300 hover:bg-sky-400 hover:scale-105"
                                >
                                    Apply for 2025-26
                                </a>

                                <a
                                    href="#academics"
                                    className="rounded-full border border-gray-300 md:border-white/20 bg-white md:bg-white/10 backdrop-blur-md px-8 py-4 text-sm font-semibold text-gray-900 md:text-white transition-all duration-300 hover:bg-gray-100 md:hover:bg-white/20"
                                >
                                    Explore Program
                                </a>
                            </div>
                        </div>


                        <div className="md:hidden px-6 mt-10 mb-16">
                            <div className="rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src={heroImages[currentImage]}
                                    alt="hero"
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        </div>

                    </div>
                </div>


                <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-3">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImage(index)}
                            className={`h-[4px] rounded-full transition-all duration-500 ${currentImage === index
                                    ? "w-16 bg-sky-500 md:bg-sky-400"
                                    : "w-6 bg-gray-300 md:bg-white/40"
                                }`}
                        />
                    ))}
                </div>

            </section>

            <section id="about" className="relative overflow-hidden px-10 bg-gradient-to-b from-white to-slate-50">
                <div className="absolute top-20 left-0 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />

                <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
                    <div className="grid items-center gap-16 lg:grid-cols-2">
                        <Reveal>
                            <div className="max-w-xl">
                                <Eyebrow>About Us</Eyebrow>
                                <h2 className="font-display mt-5 text-4xl font-semibold leading-tight text-slate-900 lg:text-5xl">
                                    A commitment to
                                    <span className="block text-[#0D8DD7]">clear vision and clearer minds.</span>
                                </h2>
                                <p className="mt-8 text-lg leading-relaxed text-slate-600">
                                    Nethradhama School of Optometry is committed to continually strengthening its academic and research programs. We take pride in providing high standards of education, training, and clinical experience.
                                </p>
                                <p className="mt-5 text-lg leading-relaxed text-slate-600">
                                    With a comprehensive curriculum and a teaching hospital at its core, NSO prepares students to become confident, ethical, and skilled optometrists ready to serve patients from their very first clinical posting.
                                </p>

                                <div className="mt-10 grid grid-cols-3 gap-6 border-t border-slate-200 pt-8">
                                    <div>
                                        <h3 className="text-3xl font-bold text-[#0D8DD7]">20+</h3>
                                        <p className="mt-1 text-sm text-slate-500">Years of Excellence</p>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-[#0D8DD7]">100%</h3>
                                        <p className="mt-1 text-sm text-slate-500">Clinical Exposure</p>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-[#0D8DD7]">4+1</h3>
                                        <p className="mt-1 text-sm text-slate-500">Program Structure</p>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center rounded-full bg-[#0D8DD7] px-8 py-3 text-sm font-semibold text-white hover:shadow-xl"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal delay={150}>
                            <div className="relative mx-auto w-full max-w-[600px]">
                                <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-[#0D8DD7]/20 blur-2xl" />
                                <div className="group relative overflow-hidden rounded-[32px] border border-white/50 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.12)] transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_40px_120px_rgba(15,23,42,0.18)]">
                                    <img
                                        src="/about.jpeg"
                                        alt="Students learning optometry"
                                        className="h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[500px] lg:h-[620px]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-white/10" />
                                    <div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 px-5 py-4 shadow-xl backdrop-blur transition-all duration-500 group-hover:-translate-y-1">
                                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Excellence in Education</p>
                                        <p className="mt-1 text-lg font-semibold text-slate-900">Future Optometrists</p>
                                    </div>
                                </div>


                                <div className="absolute -left-8 top-10 hidden rounded-2xl bg-white p-5 shadow-xl lg:block animate-[float_5s_ease-in-out_infinite]">
                                    <h3 className="text-2xl font-bold text-[#0D8DD7]">20+</h3>
                                    <p className="text-sm text-slate-600">Years Experience</p>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            <Whatwe />

            <section id="academics" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
                <div
                    ref={academicsLens}
                    style={{ transform: `translateY(${academicsLensY}px)` }}
                    className="pointer-events-none absolute -left-20 top-20 opacity-70"
                >
                    <Lens className="h-72 w-72 text-[#0D8DD7]/10" />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
                    <Reveal>
                        <div className="mx-auto max-w-3xl text-center">
                            <Eyebrow>Academics</Eyebrow>
                            <h2 className="font-display mt-5 text-4xl font-semibold text-slate-900 sm:text-5xl">
                                The B.Sc. Optometry Program
                            </h2>
                            <p className="mt-6 text-lg leading-relaxed text-slate-600">
                                A carefully structured curriculum combining classroom learning, clinical exposure, research opportunities, and professional development to prepare future optometrists.
                            </p>
                        </div>
                    </Reveal>

                    <div className="mt-16 grid gap-6 md:grid-cols-1 lg:grid-cols-1">

                        {academics.map((a, i) => (
                            <FadeUp key={a.k} delay={i * 80}>
                                <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-gray-100 shadow-sm transition-all duration-500 hover:border-[#0D8DD7]/30 hover:shadow-2xl">
                                    <div className="flex flex-col md:flex-row h-full">
                                        <div className="w-full  md:w-[60%] p-8 flex flex-col justify-center">
                                            <h3 className="text-2xl font-semibold text-slate-900">
                                                {a.k}
                                            </h3>

                                            <p className="mt-4 text-lg leading-relaxed text-slate-600">
                                                {a.v}
                                            </p>

                                            <div className="mt-6 h-[3px] w-0 bg-[#0D8DD7]/40 rounded-full transition-all duration-500 group-hover:w-full group-hover:bg-[#0D8DD7]" />
                                        </div>


                                        {a.img && (
                                            <div className="w-full p-10 md:w-[40%]">
                                                <img
                                                    src={a.img}
                                                    alt={a.k}
                                                    className="h-[370px] rounded-3xl w-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </FadeUp >
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
                                <h3 className="font-display mt-4 text-3xl font-semibold text-white">
                                    Recognized Research Excellence
                                </h3>
                                <p className="mt-6 max-w-4xl text-lg leading-relaxed text-blue-50">
                                    Our students
                                    <span className="font-semibold text-white"> Ms. Nikhita R Bhat, Ms. Pooja Kumari Sah, and Mr. Anvith M Agumbe</span>
                                    {" "}were selected for the prestigious
                                    <span className="font-semibold text-white"> RGUHS UG-AHS Research Grant</span>
                                    {" "}for the academic year 2021–22, highlighting the institution's strong emphasis on innovation, scientific inquiry, and evidence-based practice.
                                </p>
                                <div className="mt-8 flex flex-wrap gap-4">
                                    <div className="rounded-full bg-white/15 px-5 py-2 text-sm font-medium text-white backdrop-blur">Research Driven</div>
                                    <div className="rounded-full bg-white/15 px-5 py-2 text-sm font-medium text-white backdrop-blur">RGUHS Recognition</div>
                                    <div className="rounded-full bg-white/15 px-5 py-2 text-sm font-medium text-white backdrop-blur">Student Innovation</div>
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
                <div className="relative mx-auto max-w-6xl px-4 py-24">
                    <Reveal className="max-w-2xl">
                        <Eyebrow>Gallery</Eyebrow>
                        <h2 className="font-display mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
                            Life and learning at NSO.
                        </h2>
                    </Reveal>

                    <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3" >
                        {gallery.map((g, i) => (
                            <GalleryCard key={g.label} item={g} index={i} featured={i === 0} />
                        ))}
                    </div>
                </div>
            </section>


            <section id="faq" className="relative bg-gradient-to-b from-white via-slate-50/40 to-white">
                <div
                    ref={faqLens}
                    style={{ transform: `translateY(${faqLensY}px)` }}
                    className="pointer-events-none absolute left-0 top-20 opacity-50"
                >
                    <Lens className="h-80 w-80 text-[#0D8DD7]/10" />
                </div>
                <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-6 py-24">
                    <div className="grid items-start gap-20 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="lg:sticky lg:top-28">
                            <Reveal>
                                <div className="max-w-md">
                                    <Eyebrow>Frequently Asked Questions</Eyebrow>
                                    <h2 className="font-display mt-5 text-5xl font-semibold leading-tight text-slate-900">
                                        Questions,
                                        <span className="block text-[#0D8DD7]">Answered.</span>
                                    </h2>
                                    <p className="mt-6 text-lg leading-relaxed text-slate-600">
                                        Everything you need to know about admissions, academics, internships, eligibility, fees and student life at Nethradhama School of Optometry.
                                    </p>

                                    <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-100">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Need Assistance?</p>
                                        <a href="tel:+917760744990" className="mt-3 block text-3xl font-bold text-[#0D8DD7] transition-all duration-300 hover:text-sky-600">
                                            +91 77607 44990
                                        </a>
                                        <p className="mt-3 text-slate-500">Speak directly with our admissions team.</p>
                                    </div>

                                    <div className="mt-10 grid grid-cols-2 gap-6">
                                        <div className="rounded-2xl bg-white p-5 shadow-md shadow-slate-100">
                                            <h3 className="text-3xl font-bold text-[#0D8DD7]">4+1</h3>
                                            <p className="mt-1 text-sm text-slate-500">Program Structure</p>
                                        </div>
                                        <div className="rounded-2xl bg-white p-5 shadow-md shadow-slate-100">
                                            <h3 className="text-3xl font-bold text-[#0D8DD7]">100%</h3>
                                            <p className="mt-1 text-sm text-slate-500">Clinical Exposure</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>

                        <div className="relative">
                            <Reveal delay={150}>
                                <div className="space-y-6">
                                    {faqs.map((f) => (
                                        <div
                                            key={f.q}
                                            className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#0D8DD7]/30 hover:shadow-xl hover:shadow-sky-100"
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
                <div className="mx-auto max-w-6xl px-4 pb-24">
                    <Reveal>
                        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 sm:p-10">
                            <Eyebrow>Anti-Ragging Cell</Eyebrow>
                            <h2 className="font-display mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
                                A campus that is safe, by commitment.
                            </h2>
                            <p className="mt-4 max-w-3xl text-slate-700">
                                Ragging in all its forms is strictly prohibited at Nethradhama School of Optometry, in line with the directives of the Hon'ble Supreme Court of India, UGC guidelines and the Ragging Prohibition Act, 1999. We maintain an Anti-Ragging Committee, a monitoring cell, a squad panel and a student mentoring cell, and collect affidavits from students and parents at admission. Anyone found guilty of ragging or of abetting it is referred to the committee for action.
                            </p>
                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl bg-white p-6">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">National Anti-Ragging Helpline (24×7)</div>
                                    <a href="tel:18001805522" className="mt-1 block text-2xl font-semibold text-slate-900">1800-180-5522</a>
                                    <a href="mailto:helpline@antiragging.in" className="text-sm text-[#0D8DD7] hover:underline">helpline@antiragging.in</a>
                                </div>
                                <div className="rounded-2xl bg-white p-6">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">Chairperson, Anti-Ragging Cell</div>
                                    <div className="mt-1 text-lg font-semibold text-slate-900">Dr. Savitha Arun</div>
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
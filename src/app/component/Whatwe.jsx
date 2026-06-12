"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Microscope, Stethoscope, Eye } from "lucide-react";

const ACCENT = "#0D8DD7";

const services = [
    {
        title: "Clinical Training",
        desc: "Structured, hands-on clinical exposure from your very first year.",
        icon: GraduationCap,
    },
    {
        title: "Diagnostics & Imaging",
        desc: "Master modern eye-examination and diagnostic technologies.",
        icon: Microscope,
    },
    {
        title: "Patient Care",
        desc: "Build excellence in patient communication and management.",
        icon: Stethoscope,
    },
    {
        title: "Vision & Optics",
        desc: "Refraction, contact lenses, low vision and binocular vision.",
        icon: Eye,
    },
];

export default function Whatwe() {
    const ref = useRef(null);
    const reduced = useReducedMotion();
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
        useTransform(scrollYProgress, W[0], [0.82, 1]),
        useTransform(scrollYProgress, W[1], [0.82, 1]),
        useTransform(scrollYProgress, W[2], [0.82, 1]),
        useTransform(scrollYProgress, W[3], [0.82, 1]),
    ];

    const slide = [
        useTransform(scrollYProgress, W[0], [-28, 0]),
        useTransform(scrollYProgress, W[1], [28, 0]),
        useTransform(scrollYProgress, W[2], [28, 0]),
        useTransform(scrollYProgress, W[3], [-28, 0]),
    ];

    const dotOp = [
        useTransform(op[0], [0, 1], [0.25, 1]),
        useTransform(op[1], [0, 1], [0.25, 1]),
        useTransform(op[2], [0, 1], [0.25, 1]),
        useTransform(op[3], [0, 1], [0.25, 1]),
    ];
    const dotSc = [
        useTransform(op[0], [0, 1], [1, 1.4]),
        useTransform(op[1], [0, 1], [1, 1.4]),
        useTransform(op[2], [0, 1], [1, 1.4]),
        useTransform(op[3], [0, 1], [1, 1.4]),
    ];



    const pos = [
        "left-[50%] top-[-50px] -translate-x-1/2",
        "right-[-170px] top-[50%] -translate-y-1/2",
        "left-[50%] bottom-[-50px] -translate-x-1/2",
        "left-[-170px] top-[50%] -translate-y-1/2",
    ];

    const spokeEnd = [
        [270, 78],
        [462, 270],
        [270, 462],
        [78, 270],
    ];


    const cardStyle = (i) => ({ opacity: op[i], scale: scale[i], y: slide[i] });

    return (
        <section
            ref={ref}
            className="relative bg-gradient-to-b from-white via-sky-50/40 to-white lg:h-[340vh]"
        >
            <div className="flex min-h-screen items-center justify-center overflow-hidden py-20 lg:sticky lg:top-0 lg:h-screen lg:py-0">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(13,141,215,0.10),transparent_60%)]" />

                <div className="mx-auto w-full max-w-7xl px-4">

                    <div className="mb-12 text-center lg:mb-10">
                        <span
                            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]"
                            style={{ background: "rgba(13,141,215,0.10)", color: ACCENT }}
                        >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
                            What we offer
                        </span>
                        <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                            
                        </h2>
                        <p className="  mx-auto my-10 max-w-2xl text-slate-600">
                            From diagnostics to clinical practice, our programs build expertise and
                            confidence — one rotation at a time.
                        </p>
                    </div>


                    <div className="relative mx-auto py-57 hidden h-[500px] w-[540px] max-w-full lg:block">

                        <div className="absolute inset-0 rounded-full border border-slate-200" />
                        <div className="absolute inset-[40px] rounded-full border border-sky-100" />
                        <div className="absolute inset-[80px] rounded-full border border-sky-50" />


                        <svg viewBox="0 0 540 540" className="pointer-events-none absolute inset-0 h-full w-full">
                            {spokeEnd.map(([x, y], i) => (
                                <g key={i}>
                                    <motion.line
                                        x1={270}
                                        y1={270}
                                        x2={x}
                                        y2={y}
                                        stroke={ACCENT}
                                        strokeWidth={1.5}
                                        strokeOpacity={0.4}
                                        strokeLinecap="round"
                                        style={{ pathLength: op[i] }}
                                    />
                                    <motion.circle cx={x} cy={y} r={4} fill={ACCENT} style={{ opacity: op[i] }} />
                                </g>
                            ))}
                        </svg>


                        <motion.div
                            animate={reduced ? {} : { rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border border-dashed border-sky-200 will-change-transform"
                        >
                            <span
                                className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_12px_rgba(13,141,215,0.6)]"
                                style={{ background: ACCENT }}
                            />
                        </motion.div>
                        <div className="absolute left-1/2 top-1/2 z-10 flex h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_20px_80px_rgba(13,141,215,0.14)]">
                            {!reduced &&
                                [0, 1].map((k) => (
                                    <motion.span
                                        key={k}
                                        className="absolute h-28 w-28 rounded-full border will-change-transform"
                                        style={{ borderColor: ACCENT }}
                                        animate={{ scale: [1, 1.9], opacity: [0.45, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: k * 1.5, ease: "easeOut" }}
                                    />
                                ))}
                            <motion.div
                                animate={reduced ? {} : { scale: [1, 1.06, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="relative flex h-28 w-28 items-center justify-center rounded-full text-white shadow-2xl will-change-transform"
                                style={{ background: `linear-gradient(135deg, ${ACCENT}, #38bdf8)` }}
                            >
                                <Eye size={48} />
                            </motion.div>
                        </div>


                        {services.map((service, i) => (
                            <motion.div key={service.title} style={cardStyle(i)} className={`absolute z-20 ${pos[i]} will-change-transform`}>
                                <ServiceCard service={service} index={i} />
                            </motion.div>
                        ))}
                    </div>


                    <div className="mt-10 hidden items-center justify-center gap-2.5 lg:flex">
                        {services.map((_, i) => (
                            <motion.span
                                key={i}
                                style={{ opacity: dotOp[i], scale: dotSc[i], background: ACCENT }}
                                className="h-2 w-2 rounded-full will-change-transform"
                            />
                        ))}
                        <span className="ml-3 text-sm text-slate-500">Scroll to explore</span>
                    </div>


                    <div className="grid gap-5 sm:grid-cols-2 lg:hidden">
                        {services.map((service, i) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                            >
                                <ServiceCard service={service} index={i} block />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ServiceCard({ service, index, block = false }) {
    const Icon = service.icon;
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className={`group ${block ? "w-full" : "w-[210px]"}`}
        >
            <div className="relative overflow-hidden rounded-3xl border border-white bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-shadow duration-300 group-hover:shadow-[0_22px_60px_-15px_rgba(13,141,215,0.35)]">
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
                    <span className="font-mono text-sm font-semibold text-slate-300">0{index + 1}</span>
                </div>
                <h3 className="relative mt-4 text-lg font-semibold text-slate-900">{service.title}</h3>
                <div className="relative grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out
                group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:mt-2">
                    <p className="overflow-hidden text-sm leading-relaxed text-black">{service.desc}</p>
                </div>
            </div>
        </motion.div>
    );
}
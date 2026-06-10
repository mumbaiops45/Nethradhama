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


const Icon = {
  pin: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  phone: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
    </svg>
  ),
  mail: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" />
    </svg>
  ),
  clock: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  ),
  check: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="2">
      <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  send: (c) => (
    <svg viewBox="0 0 24 24" fill="none" className={c} stroke="currentColor" strokeWidth="1.6">
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" strokeLinejoin="round" />
    </svg>
  ),
};

const ADDRESS_LINES = [
  "Nethradhama School of Optometry",
  "(Recognized by Govt. of Karnataka & Affiliated to RGUHS)",
  "No. 818, 13th Cross, 7th Block West,",
  "Jayanagar, Bangalore – 560082",
];
const MAP_QUERY = "Nethradhama School of Optometry, 818 13th Cross 7th Block West Jayanagar Bangalore 560082";
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;

const details = [
  { icon: Icon.pin, label: "Address", lines: ["No. 818, 13th Cross, 7th Block West,", "Jayanagar, Bangalore – 560082"] },
  { icon: Icon.phone, label: "Telephone", lines: ["080-26716152", "+91 77607 44990"], hrefs: ["tel:08026716152", "tel:+917760744990"] },
  { icon: Icon.mail, label: "Email", lines: ["optoschool@nethradhama.org"], hrefs: ["mailto:optoschool@nethradhama.org"] },
  { icon: Icon.clock, label: "Office Hours", lines: ["09:00 AM – 05:00 PM"] },
];


function Field({ label, name, value, onChange, error, type = "text", required, placeholder, textarea }) {
  const base =
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-[#0D8DD7] focus:ring-2 focus:ring-[#0D8DD7]/20";
  const border = error ? "border-red-300" : "border-stone-300";
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-[#0D8DD7]">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${base} ${border} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${base} ${border}`}
        />
      )}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const empty = { firstName: "", lastName: "", email: "", phone: "", message: "" };

export default function Page() {
  const [heroL1, heroL1Y] = useParallax(0.24);
  const [heroL2, heroL2Y] = useParallax(0.15);

  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.firstName.trim()) er.firstName = "Please enter your first name.";
    if (!form.lastName.trim()) er.lastName = "Please enter your last name.";
    if (!form.email.trim()) er.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "Please enter a valid email.";
    if (form.phone.trim() && !/^[+]?[\d\s-]{7,15}$/.test(form.phone)) er.phone = "Please enter a valid phone number.";
    if (!form.message.trim()) er.message = "Please enter a message.";
    return er;
  };

  const handleSubmit = () => {
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;
    setSent(true);
    setForm(empty);
  };

  return (
    <div className="min-h-screen bg-stone-50  text-slate-700 antialiased selection:bg-[#0D8DD7]">
      <ScrollProgress />

      
      <section className="relative overflow-hidden">
        <div ref={heroL1} style={{ transform: `translateY(${heroL1Y}px)` }} className="pointer-events-none absolute -right-16 -top-12 will-change-transform">
          <Lens className="h-72 w-72 text-[#0D8DD7]/50" />
        </div>
        <div ref={heroL2} style={{ transform: `translateY(${heroL2Y}px)` }} className="pointer-events-none absolute -bottom-28 -left-24 will-change-transform">
          <Lens className="h-80 w-80 text-amber-200/50" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-24">
          <Reveal className="max-w-3xl">
            <Eyebrow>Contact · Jayanagar, Bengaluru</Eyebrow>
            <h1 className="mt-5  text-4xl font-semibold leading-[1.08] text-slate-900 sm:text-5xl lg:text-6xl">
              Get in touch
              <br />
              <span className="text-[#0D8DD7]">with us.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Questions about admissions, the program or a campus visit? Send us a message or reach us directly using the details below.
            </p>
          </Reveal>
        </div>
      </section>

     
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-5">
          
          <Reveal className="lg:col-span-3">
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6 sm:p-8">
              <Eyebrow>Send us a message</Eyebrow>
              {sent ? (
                <div className="mt-8 flex flex-col items-center rounded-2xl border border-[#0D8DD7]/20 bg-white px-6 py-12 text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[#0D8DD7] text-white">
                    {Icon.check("h-7 w-7")}
                  </div>
                  <h3 className="mt-4  text-2xl font-semibold text-slate-900">Thank you!</h3>
                  <p className="mt-2 max-w-sm text-sm text-slate-600">
                    Your message has been received. Our administrator will get back to you soon.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 rounded-full border border-stone-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-[#0D8DD7] hover:text-[#0D8DD7]"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="First name" name="firstName" value={form.firstName} onChange={onChange} error={errors.firstName} required placeholder="Your first name" />
                    <Field label="Last name" name="lastName" value={form.lastName} onChange={onChange} error={errors.lastName} required placeholder="Your last name" />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} required placeholder="you@example.com" />
                    <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange} error={errors.phone} placeholder="+91 ..." />
                  </div>
                  <Field label="Message" name="message" value={form.message} onChange={onChange} error={errors.message} required placeholder="How can we help?" textarea />
                  <button
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0D8DD7] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {Icon.send("h-4 w-4")} Send message
                  </button>
                </div>
              )}
            </div>
          </Reveal>

         
          <Reveal delay={120} className="lg:col-span-2">
            <div className="h-full rounded-3xl bg-slate-900 p-6 text-stone-300 sm:p-8">
              <h2 className=" text-2xl font-semibold text-white">Get in touch</h2>
              <p className="mt-2 text-sm text-stone-400">We'd love to hear from you.</p>
              <div className="mt-8 space-y-6">
                {details.map((d) => (
                  <div key={d.label} className="flex gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-[#5cb8ec]">
                      {d.icon("h-5 w-5")}
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">{d.label}</div>
                      <div className="mt-1 space-y-0.5 text-sm">
                        {d.lines.map((line, idx) =>
                          d.hrefs?.[idx] ? (
                            <a key={line} href={d.hrefs[idx]} className="block text-white transition-colors hover:text-[#5cb8ec]">
                              {line}
                            </a>
                          ) : (
                            <div key={line} className="text-stone-300">{line}</div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

   
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-stone-200 shadow-sm">
              <iframe
                title="Nethradhama School of Optometry location"
                src={MAP_SRC}
                className="h-[420px] w-full grayscale-[0.2]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
           
              <div className="pointer-events-none absolute bottom-5 left-5 max-w-xs rounded-2xl bg-white/95 p-5 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[#0D8DD7]">
                  {Icon.pin("h-5 w-5")}
                  <span className="text-xs font-semibold uppercase tracking-wider">Find us here</span>
                </div>
                <div className="mt-2 space-y-0.5 text-sm leading-snug text-slate-700">
                  {ADDRESS_LINES.slice(2).map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
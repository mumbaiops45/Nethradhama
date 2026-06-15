
"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { academics } from '../data/data';


const Academics = () => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end end"],
    });
    return (
        <section className='bg-gradient-to-b from-white via-sky-50/40 to-white'>
            <div ref={container} className='relative'>
                {academics.map((a, i) => {
                    const targetScale = 1 - (academics.length - i) * 0.04;
                    return (
                        <Card
                            key={a.k}
                            data={a}
                            index={i}
                            total={academics.length}
                            progress={scrollYProgress}
                            range={[i * (1 / academics.length), 1]}
                            targetScale={targetScale}
                        />
                    )
                })}

            </div>
        </section>
    );
}


function Card({ data, index, progress, range }) {
  

    return (
        <div className='sticky top-0 flex h-screen items-center justify-center px-4'>
            <motion.div
                style={{
                    top: `calc(-12vh + ${index * 28}px)`,
                }}
                className='group relative w-full max-w-6xl origin-top overflow-hidden rounded-3xl border border-slate-200 bg-gray-100 shadow-2xl will-change-transform'
            >
                <div className='flex h-full flex-col md:flex-row'>
                    <div className='flex w-full flex-col justify-center p-8 md:w-[70%] md:p-10'>
                        <span className='font-mono text-sm font-semibold text-[#0D8DD7]'>0{index + 1}</span>
                        <h3 className='mt-2 text-2xl font-semibold text-slate-900 md:text-3xl'>{data.k}</h3>
                        <p className='mt-4 text-base leading-relaxed text-slate-600 md:text-lg'>{data.v}</p>
                        <div className='mt-6 h-[3px] w-0 rounded-full bg-[#0D8DD7]/40 transition-all duration-500 group-hover:w-full group-hover:bg-[#0D8DD7]' />
                    </div>

                    {data.img && (
                        <div className='w-full p-6 md:w-[55%] md:p-8'>
                            <CardImage src={data.img} alt={data.k} progress={progress} range={range} />

                        </div>
                    )}

                </div>

            </motion.div>

        </div>
    );
}


function CardImage({ src, alt, progress, range }) {
    const imageScale = useTransform(progress, range, [1.18, 1]);
    return (
        <div className='h-[260px] overflow-hidden rounded-3xl md:h-[370px]'>
            <motion.img
                src={src}
                alt={alt}
                style={{ scale: imageScale }}
                className='h-full w-full object-cover will-change-transform'
            />
        </div>
    )
}

export default Academics

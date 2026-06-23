"use client";

import { motion } from "framer-motion";

const experiences = [
  {
    period: "2023 — Present",
    role: "Senior Engineer",
    company: "Prism Labs",
    details: "Led frontend architecture for real-time data platform serving 500k+ users. Reduced bundle size by 45%.",
  },
  {
    period: "2021 — 2023",
    role: "Full Stack Engineer",
    company: "Velocity",
    details: "Built distributed task scheduler handling 10M+ jobs daily. Mentored team of 4 engineers.",
  },
  {
    period: "2019 — 2021",
    role: "Frontend Engineer",
    company: "Craft Studio",
    details: "Designed and implemented component library used across 15+ products. Established performance standards.",
  },
  {
    period: "2018 — 2019",
    role: "Junior Developer",
    company: "Startup Labs",
    details: "First role building production systems. Shipped features for SaaS platform with 10k paying customers.",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 md:py-32 border-t border-zinc-800">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-12">Experience</h2>

          <div className="space-y-8">
            {experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative pl-6 border-l border-zinc-700 hover:border-emerald-600 transition-colors duration-300"
              >
                <div className="absolute left-0 top-2 w-3 h-3 bg-emerald-600 rounded-full -translate-x-1.5" />

                <div className="space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                    <span className="text-sm text-zinc-500">{exp.period}</span>
                  </div>
                  <p className="text-emerald-500 text-sm font-medium">{exp.company}</p>
                  <p className="text-zinc-400 leading-relaxed">{exp.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

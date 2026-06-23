"use client";

import { motion } from "framer-motion";

export default function About() {
  const skills = [
    "React & Next.js",
    "TypeScript",
    "Node.js",
    "Tailwind CSS",
    "Web Performance",
    "System Design",
  ];

  return (
    <section id="about" className="py-32 bg-white border-t border-zinc-200">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-5xl font-black tracking-tight">About</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <p className="text-lg text-zinc-700 leading-relaxed">
                We are a creative studio focused on culture, luxury, and the future of digital experiences.
              </p>

              <p className="text-lg text-zinc-700 leading-relaxed">
                Our work bridges product strategy with technical implementation—turning ideas into 
                tangible, user-centric solutions.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-800 mb-4 uppercase tracking-wide">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-sm transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    id: 1,
    name: "Zenwave",
    desc: "Real-time analytics platform for acoustic data monitoring.",
    tech: ["React", "TypeScript", "WebSocket"],
    size: "lg",
  },
  {
    id: 2,
    name: "Notecraft",
    desc: "Markdown editor with collaborative editing.",
    tech: ["Next.js", "Prisma"],
    size: "sm",
  },
  {
    id: 3,
    name: "PixelSync",
    desc: "Image optimization service with batch processing.",
    tech: ["Node.js", "Sharp"],
    size: "sm",
  },
  {
    id: 4,
    name: "Meshwork",
    desc: "Network visualization tool for system architects.",
    tech: ["D3.js", "React"],
    size: "lg",
  },
];

export default function Projects() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section id="projects" className="py-32 bg-zinc-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-12">
          <h2 className="text-5xl font-black tracking-tight">Selected Work</h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((p) => (
            <motion.a
              key={p.id}
              href="#"
              variants={item}
              className={`group relative bg-white border border-zinc-200 hover:border-zinc-400 p-8 transition-all duration-300 ${
                p.size === "lg" ? "md:row-span-2" : ""
              }`}
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-zinc-900">{p.name}</h3>
                <p className="text-zinc-600">{p.desc}</p>

                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="text-xs px-3 py-1 bg-zinc-100 text-zinc-700">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-2 text-sm text-zinc-500 group-hover:text-red-600 transition-colors">
                  <span>View Project</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

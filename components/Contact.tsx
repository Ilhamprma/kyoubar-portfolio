"use client";

import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-32 bg-white border-t border-zinc-200">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-black tracking-tight mb-12">Get in touch</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-lg text-zinc-700 leading-relaxed mb-8">
                Have a project in mind? Let's discuss how we can work together.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-zinc-700">
                  <Mail className="w-5 h-5" />
                  <span>hello@lab.studio</span>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-zinc-900 text-zinc-900 outline-none transition-colors"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-zinc-900 text-zinc-900 outline-none transition-colors"
                />
              </div>

              <div>
                <textarea
                  rows={5}
                  placeholder="Message"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 focus:border-zinc-900 text-zinc-900 outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-4 bg-black hover:bg-zinc-800 text-white transition-colors font-medium"
              >
                Send <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

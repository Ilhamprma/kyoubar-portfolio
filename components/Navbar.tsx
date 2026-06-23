"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "@phosphor-icons/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Monitor scroll to toggle background visibility/glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full py-5 px-6 sm:px-12 ${
        isScrolled 
          ? "bg-[#050505]/70 backdrop-blur-md border-b border-white/5 shadow-lg py-4" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Left Side: Brand Logo */}
        <a href="#" className="text-base font-black tracking-tighter text-white hover:opacity-80 transition-opacity">
          +1 / KYOUBAR
        </a>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex items-center space-x-10 text-[10px] font-mono tracking-widest uppercase ml-auto mr-12">
          <a href="#work" className="text-zinc-400 hover:text-white transition-colors duration-200 font-bold">
            Work
          </a>
          <a href="#about" className="text-zinc-400 hover:text-white transition-colors duration-200 font-bold">
            About
          </a>
          <a href="#contact" className="text-zinc-400 hover:text-white transition-colors duration-200 font-bold">
            Contact
          </a>
        </div>

        {/* Right Side: CTA Button */}
        <div className="hidden md:block">
          <a
            href="#contact"
            className="bg-white text-black hover:bg-zinc-200 transition-all duration-300 rounded-full py-1.5 pl-5 pr-1.5 flex items-center gap-3 text-[10px] font-bold font-mono tracking-widest uppercase shadow-lg select-none active:scale-[0.98]"
          >
            <span>Get in touch</span>
            <span className="w-8 h-8 rounded-full bg-[#ff3b00] text-white flex items-center justify-center transition-transform group hover:rotate-45">
              <ArrowUpRight className="w-4 h-4" weight="bold" />
            </span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:opacity-75 focus:outline-none transition-opacity cursor-pointer flex flex-col justify-center items-end space-y-[4px] w-5 h-5 md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`h-[1.5px] bg-white transition-all duration-300 ${isOpen ? 'w-5 rotate-45 translate-y-[3.5px]' : 'w-4'}`}></span>
          <span className={`h-[1.5px] bg-white transition-all duration-300 ${isOpen ? 'w-5 -rotate-45 -translate-y-[2px]' : 'w-5'}`}></span>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden ${
          isOpen ? "max-h-64 opacity-100 mt-4 border-t border-white/5 pt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4 text-[10px] font-mono tracking-widest uppercase pb-2">
          <a
            href="#work"
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white transition-colors py-1 block"
          >
            Work
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white transition-colors py-1 block"
          >
            About
          </a>
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white transition-colors py-1 block"
          >
            Contact
          </a>
          
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="bg-white text-black hover:bg-zinc-200 transition-all rounded-full py-1.5 pl-5 pr-1.5 flex items-center justify-between text-[10px] font-bold font-mono tracking-widest uppercase shadow-lg select-none w-full max-w-[200px]"
          >
            <span>Get in touch</span>
            <span className="w-8 h-8 rounded-full bg-[#ff3b00] text-white flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" weight="bold" />
            </span>
          </a>
        </div>
      </div>
    </nav>
  );
}

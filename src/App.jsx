import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { Users, Server, Briefcase, ShieldCheck, FileText, Globe, CheckCircle, ArrowRight, BarChart3, Database, Layers } from 'lucide-react';
import Tilt from 'react-parallax-tilt'; // Ensure you installed this: npm install react-parallax-tilt

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    // 1. Luxury Smooth Scroll
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    let ctx = gsap.context(() => {
      // 2. Global Stagger Animation for Text
      const animatedElements = gsap.utils.toArray('.animate-up');
      animatedElements.forEach((el) => {
        gsap.fromTo(el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
            }
          }
        );
      });

      // 3. Smart Pinning Logic (The Fix)
      const sections = gsap.utils.toArray('.depth-section');
      sections.forEach((section, i) => {
        // Skip Footer
        if (i === sections.length - 1) return;

        // Check if section is "Tall" (Detailed Content)
        // If it's taller than the viewport, DO NOT pin it. Let it scroll naturally.
        const isTallSection = section.offsetHeight > window.innerHeight + 50;

        if (!isTallSection) {
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            pin: true,
            pinSpacing: false,
            end: "+=100%",
            scrub: true,
          });
        }

        // The "Fade & Scale" Exit Animation
        // This still applies so the section underneath fades out as the new one arrives
        gsap.to(section, {
          scale: 0.95,
          opacity: 0.0,
          filter: "blur(15px)",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sections[i + 1], // Watch the next section
            start: "top bottom",    // When next section hits bottom of viewport
            end: "top top",         // When next section hits top of viewport
            scrub: true,
          }
        });
      });

      // 4. Parallax Backgrounds
      gsap.utils.toArray('.parallax-bg').forEach((bg) => {
        gsap.to(bg, {
          y: "20%",
          ease: "none",
          scrollTrigger: {
            trigger: bg.parentNode,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-black text-white selection:bg-teal-500 selection:text-black font-sans">

      {/* --- SECTION 1: HERO (Pinned / Fixed) --- */}
      <section className="depth-section h-screen w-full relative flex items-center justify-center overflow-hidden z-10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/assets/hero_bg.png"
            alt="Oklahoma Horizon"
            className="parallax-bg w-full h-[120%] object-cover -mt-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/90"></div>
        </div>

        <div className="relative z-10 text-center max-w-7xl px-6 pt-20">
          <div className="animate-up mb-10">
            <img src="/assets/logo.png" alt="OKNBS" className="h-32 md:h-48 mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700" />
          </div>

          <h1 className="animate-up text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-white drop-shadow-2xl">
            OKLAHOMA NATIVE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">BUSINESS SOLUTIONS</span>
          </h1>

          <div className="animate-up flex flex-wrap justify-center gap-4 md:gap-8 mb-12 text-xs md:text-sm font-mono tracking-[0.2em] text-teal-400 uppercase">
            <span className="flex items-center gap-2 border border-teal-500/30 px-4 py-2 rounded-full bg-teal-950/30 backdrop-blur-md">
              <CheckCircle size={14} /> SBA 8(a) Processing
            </span>
            <span className="flex items-center gap-2 border border-teal-500/30 px-4 py-2 rounded-full bg-teal-950/30 backdrop-blur-md">
              <CheckCircle size={14} /> Tribally Owned
            </span>
            <span className="flex items-center gap-2 border border-teal-500/30 px-4 py-2 rounded-full bg-teal-950/30 backdrop-blur-md">
              <CheckCircle size={14} /> Defense Ready
            </span>
          </div>

          <div className="animate-up">
            <button className="group relative px-10 py-4 bg-red-600 overflow-hidden rounded-sm font-bold tracking-wider transition-all shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:shadow-[0_0_60px_rgba(239,68,68,0.6)]">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="relative flex items-center gap-2">
                EXPLORE CAPABILITIES <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: EXPANDED SERVICES (Long Scroll - NOT Pinned) --- */}
      {/* Changed h-screen to min-h-screen and py-32 to accommodate content */}
      <section className="depth-section min-h-screen w-full relative flex flex-col justify-center overflow-hidden z-20 bg-slate-950 py-32">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/services_bg.png"
            alt="Our Team"
            className="parallax-bg w-full h-[120%] object-cover opacity-40 grayscale mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6">
          <div className="animate-up mb-16 border-l-4 border-teal-500 pl-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Operational Competencies</h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl">
              Delivering precision administrative, technical, and program management support for mission-critical environments.
            </p>
          </div>

          {/* PRIMARY GRID (3x2 Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Users,
                title: "Staffing & Personnel",
                desc: "Rapid deployment for Commercial & Federal contracts. Full lifecycle personnel program activity."
              },
              {
                icon: BarChart3,
                title: "Program Management",
                desc: "Integrated Master Schedules (IMS), Earned Value Management (EVM), and assessments."
              },
              {
                icon: Database,
                title: "Data & Configuration",
                desc: "Secure records management, business systems support, and technical data analysis."
              },
              {
                icon: Briefcase,
                title: "Financial Support",
                desc: "Procurement administration, analyst support, accounting, and financial management support."
              },
              {
                icon: Layers,
                title: "Admin Services",
                desc: "NAICS 561110 Office Administration, clerical support, document preparation, and executive search."
              },
              {
                icon: Globe,
                title: "Training & Development",
                desc: "Technical training, employee development programs, and technical manual production."
              }
            ].map((item, idx) => (
              <Tilt key={idx} tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} scale={1.02} className="h-full">
                <div className="animate-up glass-card group p-8 rounded-xl h-full flex flex-col justify-between hover:border-teal-500/50 transition-all duration-500 bg-gradient-to-b from-white/5 to-transparent shadow-lg hover:shadow-teal-900/20 cursor-pointer">
                  <div>
                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition-colors">
                      <item.icon className="w-7 h-7 text-teal-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-teal-400 transition-colors">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 mt-4">{item.desc}</p>
                </div>
              </Tilt>
            ))}
          </div>

          {/* SECONDARY LIST (The Detailed Part) */}
          <div className="animate-up mt-16 pt-16 border-t border-white/10">
            <h3 className="text-sm font-mono tracking-widest text-gray-500 uppercase mb-8">// FULL CAPABILITY INDEX</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm text-gray-400">
              {[
                "Resource Management", "Program Assessments", "Integrated Master Schedules", "Accounting",
                "Configuration Management", "Data Management", "Earned Value Management", "Technical Training",
                "Clerical Support", "Financial Management", "Personnel Program Activity", "Employee Development",
                "Employee Benefits", "Personnel Action Processing", "Procurement Admin", "Analyst Support",
                "Business Systems Support", "Records Management"
              ].map((capability, i) => (
                <div key={i} className="flex items-center gap-3 hover:text-white transition-colors group cursor-crosshair">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all shadow-[0_0_8px_rgba(20,184,166,0.8)]"></div>
                  {capability}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: COMPLIANCE (Pinned / Fixed) --- */}
      <section className="depth-section h-screen w-full relative flex flex-col z-30 bg-teal-950">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/compliance_bg.png"
            alt="Secure Vault"
            className="parallax-bg w-full h-[120%] object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-teal-950/90 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 flex-grow flex flex-col justify-center items-center px-6">
          <div className="w-full max-w-[90rem] flex flex-col md:flex-row gap-16 items-center">

            {/* Left Side: The Big Number */}
            <div className="animate-up md:w-1/2">
              <div className="inline-block border border-teal-500/30 px-4 py-1 rounded-full text-teal-400 font-mono text-xs tracking-widest mb-6 bg-teal-950/50">
                CLASSIFICATION: UNCLASSIFIED
              </div>
              <h2 className="text-8xl md:text-[10rem] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 font-mono">
                561110
              </h2>
              <p className="text-2xl text-teal-400 font-light mt-4 tracking-wide border-l-4 border-red-500 pl-6">
                Primary NAICS: Office Administration
              </p>
            </div>

            {/* Right Side: The Data Grid */}
            <div className="animate-up md:w-1/2 grid grid-cols-2 gap-6">
              {[
                { code: "541611", label: "Admin Mgmt Consulting" },
                { code: "541612", label: "HR & Executive Search" },
                { code: "561210", label: "Facilities Support" },
                { code: "561410", label: "Document Preparation" },
                { code: "561421", label: "Telephone Answering" },
                { code: "561499", label: "Business Support" }
              ].map((item, i) => (
                <div key={i} className="group border border-white/10 bg-black/20 p-6 hover:bg-teal-900/20 hover:border-teal-500/50 transition-all duration-300 backdrop-blur-sm cursor-pointer">
                  <div className="text-teal-500 font-mono text-xl font-bold mb-2 group-hover:text-white transition-colors group-hover:shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-shadow">{item.code}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Integrated */}
        <div className="relative z-20 bg-black border-t border-white/10 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end">
            <div className="animate-up">
              <img src="/assets/logo.png" className="h-12 mb-6 opacity-60 grayscale hover:grayscale-0 transition-all" alt="Footer Logo" />
              <address className="text-gray-500 not-italic leading-loose">
                602 N Cherokee Ave.<br />Claremore, OK 74017
              </address>
            </div>
            <div className="animate-up text-right mt-8 md:mt-0">
              <a href="mailto:Scott.Bickford@oknbs.com" className="text-2xl font-bold text-white hover:text-teal-400 transition-colors block mb-2">
                Scott.Bickford@oknbs.com
              </a>
              <p className="text-teal-600 font-mono text-lg">918-923-7160</p>
              <p className="text-xs text-gray-700 mt-8">© 2026 Oklahoma Native Business Solutions, LLC. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;

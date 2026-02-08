import React, { useLayoutEffect, useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Tilt from 'react-parallax-tilt';
import {
  Users, Briefcase, Globe, CheckCircle, ArrowRight,
  BarChart3, Database, Layers, Shield, FileText,
  ChevronDown, Mail, Phone, MapPin, Menu, X,
  Award, Target, Zap, Lock, Eye, TrendingUp,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const BASE = import.meta.env.BASE_URL;

/* ============================================
   MAGNETIC BUTTON COMPONENT
   ============================================ */
const MagneticButton = ({ children, className = '', strength = 0.3, onClick }) => {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`magnetic-btn ${className}`}
    >
      {children}
    </button>
  );
};

/* ============================================
   CURSOR FOLLOWER COMPONENT
   ============================================ */
const CursorFollower = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const moveCursor = (e) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.45, ease: 'power3.out' });
    };

    const handleEnter = () => {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    };
    const handleLeave = () => {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    };

    window.addEventListener('mousemove', moveCursor);
    const observe = () => {
      const els = document.querySelectorAll('a, button, [data-cursor], .glass-card, .nav-link');
      els.forEach((el) => {
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
    };
    observe();
    const observer = new MutationObserver(observe);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
    };
  }, []);

  if (typeof window !== 'undefined' && window.innerWidth < 1024) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden lg:block" />
      <div ref={ringRef} className="cursor-ring hidden lg:block" />
    </>
  );
};

/* ============================================
   ANIMATED COUNTER COMPONENT
   ============================================ */
const AnimatedCounter = ({ end, suffix = '', prefix = '', duration = 2 }) => {
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: end,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
            },
          });
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, suffix, prefix, duration]);

  return <span ref={ref} className="counter-value">0</span>;
};

/* ============================================
   SPOTLIGHT CARD WRAPPER
   ============================================ */
const SpotlightCard = ({ children, className = '' }) => {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };
  return (
    <div onMouseMove={handleMouseMove} className={`spotlight-card ${className}`}>
      {children}
    </div>
  );
};

/* ============================================
   READING PROGRESS BAR
   ============================================ */
const ReadingProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <div ref={barRef} className="reading-progress" />;
};

/* ============================================
   NAV DATA
   ============================================ */
const navLinks = [
  { label: 'Mission', href: '#mission' },
  { label: 'Services', href: '#services' },
  { label: 'Compliance', href: '#compliance' },
  { label: 'Contact', href: '#contact' },
];

/* ============================================
   SERVICE DATA
   ============================================ */
const services = [
  {
    icon: Users,
    title: 'Staffing & Personnel',
    desc: 'Rapid deployment for Commercial & Federal contracts. Full lifecycle personnel program activity, benefits administration, and executive search.',
    accent: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
    hoverBorder: 'hover:border-blue-500/30',
  },
  {
    icon: BarChart3,
    title: 'Program Management',
    desc: 'Integrated Master Schedules (IMS), Earned Value Management (EVM), program assessments, and resource management.',
    accent: 'from-cyan-500/20 to-teal-500/20',
    iconColor: 'text-cyan-400',
    hoverBorder: 'hover:border-cyan-500/30',
  },
  {
    icon: Database,
    title: 'Data & Configuration',
    desc: 'Secure records management, business systems support, configuration management, and technical data analysis.',
    accent: 'from-indigo-500/20 to-blue-500/20',
    iconColor: 'text-indigo-400',
    hoverBorder: 'hover:border-indigo-500/30',
  },
  {
    icon: Briefcase,
    title: 'Financial Support',
    desc: 'Procurement administration, analyst support, accounting, financial management, and budget execution.',
    accent: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/30',
  },
  {
    icon: Layers,
    title: 'Admin Services',
    desc: 'NAICS 561110 Office Administration, clerical support, document preparation, and administrative consulting.',
    accent: 'from-violet-500/20 to-indigo-500/20',
    iconColor: 'text-violet-400',
    hoverBorder: 'hover:border-violet-500/30',
  },
  {
    icon: Globe,
    title: 'Training & Development',
    desc: 'Technical training programs, employee development, technical manual production, and workforce readiness.',
    accent: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-400',
    hoverBorder: 'hover:border-amber-500/30',
  },
];

/* ============================================
   NAICS DATA
   ============================================ */
const naicsCodes = [
  { code: '561110', label: 'Office Administration', primary: true },
  { code: '541611', label: 'Admin Management Consulting' },
  { code: '541612', label: 'HR & Executive Search' },
  { code: '561210', label: 'Facilities Support' },
  { code: '561410', label: 'Document Preparation' },
  { code: '561421', label: 'Telephone Answering' },
  { code: '561499', label: 'Business Support Services' },
];

/* ============================================
   STATS DATA
   ============================================ */
const stats = [
  { value: 8, suffix: '(a)', label: 'SBA Certified', icon: Award },
  { value: 100, suffix: '%', label: 'Native Owned', icon: Shield },
  { value: 7, suffix: '+', label: 'NAICS Codes', icon: Target },
  { value: 24, suffix: '/7', label: 'Mission Ready', icon: Zap },
];

/* ============================================
   CAPABILITY INDEX
   ============================================ */
const capabilities = [
  'Resource Management', 'Program Assessments', 'Integrated Master Schedules', 'Accounting',
  'Configuration Management', 'Data Management', 'Earned Value Management', 'Technical Training',
  'Clerical Support', 'Financial Management', 'Personnel Program Activity', 'Employee Development',
  'Employee Benefits', 'Personnel Action Processing', 'Procurement Administration', 'Analyst Support',
  'Business Systems Support', 'Records Management',
];


/* ============================================
   MAIN APP COMPONENT
   ============================================ */
const App = () => {
  const containerRef = useRef(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* --- Smooth Scroll + GSAP Setup --- */
  useLayoutEffect(() => {
    // Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Scroll-based nav background
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // GSAP Animation Context
    const ctx = gsap.context(() => {

      // --- Animate-Up Elements ---
      gsap.utils.toArray('.animate-up').forEach((el) => {
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // --- Stagger Groups ---
      gsap.utils.toArray('.stagger-group').forEach((group) => {
        const children = group.querySelectorAll('.stagger-item');
        gsap.fromTo(children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 85%',
            },
          }
        );
      });

      // --- Parallax Backgrounds ---
      gsap.utils.toArray('.parallax-bg').forEach((bg) => {
        gsap.to(bg, {
          y: '20%',
          ease: 'none',
          scrollTrigger: {
            trigger: bg.parentNode,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // --- Hero Fade-Out on Scroll ---
      gsap.to('#hero', {
        opacity: 0,
        scale: 0.97,
        filter: 'blur(8px)',
        ease: 'none',
        scrollTrigger: {
          trigger: '#stats',
          start: 'top bottom',
          end: 'top 30%',
          scrub: true,
        },
      });

      // --- Hero Text Entrance ---
      const heroTl = gsap.timeline({ delay: 0.3 });
      heroTl
        .fromTo('.hero-logo', { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' })
        .fromTo('.hero-title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.6')
        .fromTo('.hero-subtitle', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .fromTo('.hero-badges', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .fromTo('.hero-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2');

      // --- Scroll indicator bounce ---
      gsap.to('.scroll-indicator', {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: 'power1.inOut',
      });

    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollTo = useCallback((href) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div ref={containerRef} className="bg-white text-[#0F172A] font-sans cursor-none lg:cursor-none cracked-earth-bg">

      {/* --- Custom Cursor --- */}
      <CursorFollower />

      {/* --- Reading Progress --- */}
      <ReadingProgress />

      {/* ============================================
          NAVIGATION
          ============================================ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        navScrolled
          ? 'glass-panel py-3 shadow-sm'
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => scrollTo('#hero')} className="flex items-center gap-3 group" data-cursor>
            <img
              src={`${BASE}assets/logo.png`}
              alt="OKNBS"
              className="h-9 drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
            />
            <span className="hidden sm:block text-sm font-bold tracking-wider text-[#64748B] group-hover:text-[#0F172A] transition-colors">
              OKNBS
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="nav-link text-sm text-[#64748B] hover:text-[#0F172A] transition-colors duration-300 tracking-wide"
                data-cursor
              >
                {link.label}
              </button>
            ))}
            <MagneticButton
              className="glass-btn text-sm px-5 py-2.5"
              onClick={() => scrollTo('#contact')}
            >
              <span className="flex items-center gap-2">
                Get Started <ArrowRight size={14} />
              </span>
            </MagneticButton>
          </div>

          <button
            className="md:hidden text-slate-700 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden glass-panel mt-2 mx-4 rounded-xl p-6 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left text-slate-600 hover:text-[#0F172A] transition-colors py-2 text-lg"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('#contact')}
              className="cta-btn w-full text-center text-sm mt-4"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>


      {/* ============================================
          SECTION 1: HERO
          ============================================ */}
      <section
        id="hero"
        className="h-screen w-full relative flex items-center justify-center overflow-hidden"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 gradient-hero aurora-bg">
          <div className="aurora-orb-1 top-1/4 left-1/3" />
        </div>

        {/* Hero BG Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/30 to-white/90" />
        </div>

        <div className="absolute inset-0 grid-bg opacity-30" />

        <div className="relative z-10 text-center max-w-6xl px-6">

          <div className="hero-logo mb-8 opacity-0">
            <img
              src={`${BASE}assets/logo.png`}
              alt="OKNBS Logo"
              className="h-24 md:h-40 mx-auto drop-shadow-lg hover:scale-105 transition-transform duration-700"
            />
          </div>

          <h1 className="hero-title opacity-0 text-4xl sm:text-5xl md:text-7xl lg:text-display-xl font-extrabold tracking-tighter mb-6 leading-[0.95]">
            <span className="text-[#0F172A]">OKLAHOMA NATIVE</span>
            <br />
            <span className="text-gradient-blue">BUSINESS SOLUTIONS</span>
          </h1>

          <p className="hero-subtitle opacity-0 text-body-lg md:text-xl text-[#64748B] max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            SBA 8(a) Certified, Tribally Owned enterprise delivering mission-critical
            administrative and technical solutions for the federal government.
          </p>

          <div className="hero-badges opacity-0 flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
            {[
              { text: 'SBA 8(a) Processing', icon: Shield },
              { text: 'Tribally Owned', icon: Award },
              { text: 'Defense Ready', icon: Lock },
            ].map((badge, i) => (
              <span key={i} className="glass-badge flex items-center gap-2">
                <badge.icon size={13} /> {badge.text}
              </span>
            ))}
          </div>

          <div className="hero-cta opacity-0">
            <MagneticButton
              className="cta-btn text-base"
              onClick={() => scrollTo('#services')}
            >
              <span className="shimmer" />
              <span className="relative flex items-center gap-3">
                EXPLORE CAPABILITIES
                <ArrowRight size={18} />
              </span>
            </MagneticButton>
          </div>

          <div className="hero-scroll opacity-0 absolute bottom-10 left-1/2 -translate-x-1/2">
            <button
              onClick={() => scrollTo('#stats')}
              className="scroll-indicator flex flex-col items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors"
              data-cursor
            >
              <span className="text-label uppercase">Scroll</span>
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
      </section>


      {/* ============================================
          SECTION: STATS BAR
          ============================================ */}
      <section id="stats" className="relative z-20">
        <div className="section-divider" />
        <div className="bg-white/80 backdrop-blur-xl py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="stagger-group grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="stagger-item text-center group">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:border-blue-300 group-hover:bg-blue-100 transition-all duration-500">
                    <stat.icon size={24} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold font-mono text-[#0F172A] mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-label text-slate-400 uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="section-divider" />
      </section>


      {/* ============================================
          SECTION 2: MISSION / ABOUT
          ============================================ */}
      <section id="mission" className="relative z-20 py-28 md:py-36 overflow-hidden gradient-section-alt aurora-bg">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="animate-up">
                <span className="glass-badge mb-6 inline-block">Our Mission</span>
              </div>
              <h2 className="animate-up text-display-md md:text-display-lg text-[#0F172A] mb-8">
                Precision-Driven<br />
                <span className="text-gradient-blue">Federal Solutions</span>
              </h2>
              <p className="animate-up text-body-lg text-[#64748B] mb-8 leading-relaxed">
                OKNBS delivers specialized administrative, technical, and management support
                services to federal agencies and commercial enterprises. As a tribally owned,
                SBA 8(a) certified firm, we combine deep operational expertise with the agility
                to meet mission-critical deadlines.
              </p>
              <p className="animate-up text-body text-slate-400 mb-10 leading-relaxed">
                From staffing and personnel management to program oversight and financial
                support, our team provides the backbone services that keep federal operations
                running at peak efficiency.
              </p>
              <div className="animate-up">
                <MagneticButton
                  className="glass-btn"
                  onClick={() => scrollTo('#services')}
                >
                  <span className="flex items-center gap-2">
                    View Our Services <ArrowRight size={16} />
                  </span>
                </MagneticButton>
              </div>
            </div>

            <div className="stagger-group grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Eye, title: 'Transparency', desc: 'Full visibility into operations, performance metrics, and deliverables.' },
                { icon: Target, title: 'Precision', desc: 'Every engagement calibrated for mission-critical accuracy and compliance.' },
                { icon: TrendingUp, title: 'Scalability', desc: 'Rapid surge capability from small teams to enterprise-scale deployments.' },
                { icon: Lock, title: 'Security', desc: 'Defense-grade protocols, CMMC-aligned practices, and secure data handling.' },
              ].map((feature, i) => (
                <SpotlightCard key={i} className="stagger-item glass-card rounded-xl p-6 group">
                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center mb-4 group-hover:border-blue-300 transition-all duration-500">
                      <feature.icon size={20} className="text-blue-500" />
                    </div>
                    <h3 className="text-heading-sm text-[#0F172A] mb-2 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                    <p className="text-body-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ============================================
          SECTION 3: SERVICES
          ============================================ */}
      <section
        id="services"
        className="min-h-screen w-full relative flex flex-col justify-center overflow-hidden z-20 py-28 md:py-36 gradient-section"
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/95 via-white/90 to-slate-50/95" />
        </div>
        <div className="absolute inset-0 grid-bg opacity-15" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <div className="animate-up mb-4">
            <span className="glass-badge">What We Do</span>
          </div>
          <div className="animate-up mb-16">
            <h2 className="text-display-md md:text-display-lg text-[#0F172A] mb-4">
              Operational <span className="text-gradient-blue">Competencies</span>
            </h2>
            <p className="text-body-lg text-[#64748B] max-w-2xl font-light">
              Delivering precision administrative, technical, and program management
              support for mission-critical environments.
            </p>
          </div>

          <div className="stagger-group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((item, idx) => (
              <Tilt
                key={idx}
                tiltMaxAngleX={4}
                tiltMaxAngleY={4}
                perspective={1200}
                scale={1.02}
                glareEnable={true}
                glareMaxOpacity={0.12}
                glareColor="#ffffff"
                glarePosition="all"
                glareBorderRadius="16px"
                className="h-full stagger-item"
              >
                <SpotlightCard className={`glass-card group rounded-2xl p-7 h-full flex flex-col ${item.hoverBorder} transition-all duration-500`}>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.accent} border border-[#E2E8F0] flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500`}>
                      <item.icon className={`w-7 h-7 ${item.iconColor} transition-colors duration-500`} />
                    </div>

                    <h3 className="text-heading-sm text-[#0F172A] mb-3 group-hover:text-[#0F172A] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-body-sm text-slate-400 leading-relaxed flex-grow group-hover:text-[#64748B] transition-colors">
                      {item.desc}
                    </p>

                    <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center gap-2 text-slate-400 group-hover:text-blue-500 transition-colors">
                      <span className="text-label">Learn More</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </SpotlightCard>
              </Tilt>
            ))}
          </div>

          <div className="animate-up mt-20 pt-16 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-glow" />
              <h3 className="text-label text-slate-400 font-mono uppercase">Full Capability Index</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-8">
              {capabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-3 text-body-sm text-slate-400 hover:text-slate-700 transition-colors duration-300 group cursor-default py-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-40 group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.4)] transition-all duration-300" />
                  {cap}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ============================================
          SECTION 4: COMPLIANCE / NAICS
          ============================================ */}
      <section
        id="compliance"
        className="min-h-screen w-full relative flex flex-col z-30 overflow-hidden gradient-teal-section"
      >
        <div className="absolute inset-0 z-0">
          <img
            src={`${BASE}assets/compliance_bg_1770572562169.png`}
            alt=""
            className="parallax-bg w-full h-[120%] object-cover opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-teal-50/30 to-white/90" />
        </div>
        <div className="absolute inset-0 grid-bg opacity-10" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-teal-200/20 blur-[120px] -top-32 -right-32 animate-float" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-200/15 blur-[100px] -bottom-24 -left-24 animate-float-delayed" />
        </div>

        <div className="relative z-10 flex-grow flex flex-col justify-center py-28 md:py-36">
          <div className="w-full max-w-7xl mx-auto px-6">

            <div className="animate-up mb-4">
              <span className="glass-badge" style={{ borderColor: 'rgba(13, 148, 136, 0.2)', color: '#0d9488', background: 'rgba(13, 148, 136, 0.06)' }}>
                <Lock size={12} className="inline mr-1.5 -mt-0.5" /> Compliance & Classification
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="animate-up lg:w-1/2">
                <div className="inline-block glass-badge mb-6" style={{ borderColor: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', background: 'rgba(239, 68, 68, 0.05)' }}>
                  CLASSIFICATION: UNCLASSIFIED
                </div>
                <h2 className="text-7xl sm:text-8xl md:text-[10rem] leading-none font-bold font-mono text-gradient-dark tracking-tighter">
                  561110
                </h2>
                <p className="text-xl md:text-2xl text-teal-600 font-light mt-6 tracking-wide flex items-center gap-4">
                  <span className="w-1 h-12 bg-gradient-to-b from-red-400 to-transparent rounded-full" />
                  Primary NAICS: Office Administration
                </p>
                <p className="text-body text-slate-400 mt-4 max-w-md leading-relaxed">
                  Comprehensive coverage across administrative, consulting, and business
                  support classifications for maximum federal contract eligibility.
                </p>
              </div>

              <div className="lg:w-1/2 stagger-group">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {naicsCodes.map((item, i) => (
                    <SpotlightCard
                      key={i}
                      className={`stagger-item glass-card rounded-xl p-5 group cursor-default ${
                        item.primary ? '!border-teal-200 !bg-teal-50/50' : ''
                      }`}
                    >
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-mono text-xl font-bold ${
                            item.primary ? 'text-teal-600' : 'text-blue-500'
                          } group-hover:text-[#0F172A] transition-colors`}>
                            {item.code}
                          </span>
                          {item.primary && (
                            <span className="text-[10px] font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full border border-teal-200">
                              PRIMARY
                            </span>
                          )}
                        </div>
                        <div className="text-body-sm text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">
                          {item.label}
                        </div>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ============================================
          SECTION 5: CONTACT / FOOTER
          ============================================ */}
      <section id="contact" className="relative z-40">
        <div className="section-divider" />

        <div className="relative overflow-hidden gradient-section-alt">
          <div className="absolute inset-0 grid-bg opacity-10" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
            <div className="grid lg:grid-cols-2 gap-16">

              <div>
                <div className="animate-up">
                  <span className="glass-badge mb-6 inline-block">Get In Touch</span>
                </div>
                <h2 className="animate-up text-display-md md:text-display-lg text-[#0F172A] mb-6">
                  Ready to<br />
                  <span className="text-gradient-blue">Partner?</span>
                </h2>
                <p className="animate-up text-body-lg text-[#64748B] mb-10 max-w-md leading-relaxed">
                  Let's discuss how OKNBS can support your federal mission requirements
                  with precision, compliance, and operational excellence.
                </p>
                <div className="animate-up">
                  <MagneticButton className="cta-btn text-base">
                    <span className="shimmer" />
                    <span className="relative flex items-center gap-3">
                      START A CONVERSATION
                      <ArrowRight size={18} />
                    </span>
                  </MagneticButton>
                </div>
              </div>

              <div className="stagger-group space-y-5 lg:pt-8">
                {[
                  {
                    icon: Mail,
                    label: 'Email',
                    value: 'Scott.Bickford@oknbs.com',
                    href: 'mailto:Scott.Bickford@oknbs.com',
                  },
                  {
                    icon: Phone,
                    label: 'Phone',
                    value: '918-923-7160',
                    href: 'tel:9189237160',
                  },
                  {
                    icon: MapPin,
                    label: 'Headquarters',
                    value: '602 N Cherokee Ave.\nClaremore, OK 74017',
                  },
                ].map((contact, i) => (
                  <SpotlightCard key={i} className="stagger-item glass-card rounded-xl p-6 group">
                    <div className="relative z-10 flex items-start gap-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:border-blue-300 transition-all duration-500">
                        <contact.icon size={20} className="text-blue-500" />
                      </div>
                      <div>
                        <div className="text-label text-slate-400 uppercase mb-1">{contact.label}</div>
                        {contact.href ? (
                          <a
                            href={contact.href}
                            className="text-heading-sm text-[#0F172A] hover:text-blue-600 transition-colors"
                            data-cursor
                          >
                            {contact.value}
                          </a>
                        ) : (
                          <address className="text-heading-sm text-[#0F172A] not-italic whitespace-pre-line">
                            {contact.value}
                          </address>
                        )}
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="section-divider" />
          <footer className="relative z-10 py-10 px-6 bg-slate-50/50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={`${BASE}assets/logo.png`}
                  className="h-8 opacity-60 hover:opacity-100 transition-all duration-500"
                  alt="OKNBS"
                />
                <span className="text-body-sm text-slate-400">
                  Oklahoma Native Business Solutions, LLC
                </span>
              </div>
              <div className="flex items-center gap-6 text-body-sm text-slate-400">
                <span>&copy; {new Date().getFullYear()} OKNBS. All Rights Reserved.</span>
                <span className="hidden sm:inline text-slate-200">|</span>
                <span className="hidden sm:inline font-mono text-label text-slate-400">
                  SBA 8(a) Certified
                </span>
              </div>
            </div>
          </footer>
        </div>
      </section>

    </div>
  );
};

export default App;

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Check, X, MessageSquare, Bot, TrendingUp,
  Globe, Users, Phone, Mail, Workflow, Layers, Target,
  Sparkles, Shield, Smartphone, BarChart3, Zap,
  UserPlus, Calendar, Clock, Star, Quote,
  ChevronRight, Menu, HelpCircle, Sun, Moon
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const features = [
  { icon: Users, title: 'Lead Management', desc: 'Capture, track, and qualify leads from WhatsApp, website, IndiaMART, and more in one place.' },
  { icon: Layers, title: 'Sales Pipeline', desc: 'Visual kanban pipeline with drag-and-drop. Move deals from new to won without switching tabs.' },
  { icon: MessageSquare, title: 'WhatsApp Inbox', desc: 'Shared team inbox for WhatsApp. Assign chats, see typing status, and respond as a team.' },
  { icon: Target, title: 'Contact 360', desc: 'Every customer interaction in one profile — calls, chats, emails, meetings, and notes.' },
  { icon: Calendar, title: 'Tasks & Meetings', desc: 'Create tasks, schedule meetings, set reminders. Syncs with your calendar.' },
  { icon: BarChart3, title: 'Reports & Analytics', desc: 'Understand your numbers. Pipeline value, conversion rates, team performance at a glance.' },
];

const aiFeatures = [
  { icon: Sparkles, title: 'AI Lead Scoring', desc: 'Automatically score leads based on engagement, source quality, and response time. Focus on the ones that matter.' },
  { icon: MessageSquare, title: 'AI Reply Suggestions', desc: 'Get smart reply suggestions for WhatsApp conversations. One tap to send. Sounds like you.' },
  { icon: Bot, title: 'AI Copilot', desc: 'Ask your CRM anything. "Which deals are at risk?" "Show me leads from this week." Get instant answers.' },
  { icon: TrendingUp, title: 'Follow-up Predictions', desc: 'AI predicts the best time to follow up and suggests the right message for each lead.' },
  { icon: Phone, title: 'AI Call Summaries', desc: 'After every call, get an auto-generated summary with key points, action items, and sentiment.' },
  { icon: Calendar, title: 'AI Meeting Notes', desc: 'Meeting recordings transcribed and summarized. Key decisions and next steps captured automatically.' },
];

const whatsAppFeatures = [
  { icon: MessageSquare, title: 'Shared Team Inbox', desc: 'Every team member sees WhatsApp conversations. No more "who replied to this lead?"' },
  { icon: UserPlus, title: 'Chat Assignment', desc: 'Assign conversations to specific team members. Balance workload across your sales team.' },
  { icon: Zap, title: 'Broadcast Campaigns', desc: 'Send bulk WhatsApp messages using approved templates. Track delivery, reads, and replies.' },
  { icon: Clock, title: 'Quick Replies & Templates', desc: 'Save common responses. Use pre-approved templates for onboarding, follow-ups, and promotions.' },
  { icon: Bot, title: 'Auto-Reply Bot', desc: 'AI bot handles initial inquiries 24/7. Collects requirements, answers FAQs, and books meetings.' },
  { icon: Shield, title: 'Lead Linking', desc: 'WhatsApp contacts automatically linked to CRM leads. Full conversation history preserved.' },
];

const testimonials = [
  { quote: 'Our team transitioned from spreadsheets to LeadSphere. The native WhatsApp automation helped us follow up with leads automatically, boosting conversions by 28% in the first quarter.', name: 'Rajesh Kumar', role: 'Founder, Kumar Steel Traders', location: 'Mumbai' },
  { quote: 'The AI Lead Scoring is remarkably accurate. It automatically labels high-priority inbound requests, allowing our reps to close deals with zero time wasted on dead leads.', name: 'Priya Sharma', role: 'Director, Apex Educational Solutions', location: 'Delhi' },
  { quote: 'Having WhatsApp, pipeline, and tasks unified inside one workspace is a game-changer. Simple enough for my team of 5, powerful enough to handle all our client data.', name: 'Vikram Mehta', role: 'CEO, Mehta Hardware & Exports', location: 'Ahmedabad' },
];

const faqs = [
  { q: 'How does the WhatsApp integration work?', a: 'LeadSphere connects via Meta WhatsApp Business API. You get a shared inbox, auto-reply bot, broadcast campaigns, and AI reply suggestions. All conversations are synced with your CRM leads and contacts.' },
  { q: 'Can I import my existing contacts and leads?', a: 'Yes. You can import contacts via CSV upload or integrate with IndiaMART, JustDial, and Google Forms. WhatsApp conversations are automatically linked to matching contacts.' },
  { q: 'Is there a contract or setup fee?', a: 'No. All plans are billed monthly with zero contract obligations. You can upgrade, downgrade, or cancel anytime from the settings. No hidden fees.' },
  { q: 'How is this different from Zoho or HubSpot?', a: 'LeadSphere is built specifically for Indian SMEs. WhatsApp is at the core — not an add-on. The interface is simpler, pricing is in INR, and AI features are included in every plan.' },
  { q: 'How long does it take to set up?', a: 'You can be up and running in under 15 minutes. Import your contacts, connect your channels, and your team can start responding immediately.' },
];

const problems = [
  { title: 'Leads slipping through the cracks', desc: 'WhatsApp messages from potential customers get lost in personal chats. No tracking, no follow-up.' },
  { title: 'Missed follow-ups cost you deals', desc: 'You mean to call back, but get busy. Days pass. The lead moves on to a competitor.' },
  { title: 'No visibility into your sales', desc: 'How many deals are you closing this month? Which source performs best? You have no data.' },
  { title: 'Team collaboration is messy', desc: 'Who replied to this lead? Is someone already working on this account? Unclear.' },
];

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ctaEmail, setCtaEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Mouse parallax for hero
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getParallaxOffset = (factor: number) => {
    if (!mounted) return {};
    const x = (mousePos.x / window.innerWidth - 0.5) * factor;
    const y = (mousePos.y / window.innerHeight - 0.5) * factor;
    return { transform: `translate(${x}px, ${y}px)` };
  };

  const toggleFaq = (index: number) => setFaqOpen(faqOpen === index ? null : index);

  const renderCell = (val: boolean | string) => {
    if (typeof val === 'boolean') {
      return val
        ? <Check className="w-4 h-4 text-accent mx-auto" />
        : <X className="w-4 h-4 text-text-muted/40 mx-auto" />;
    }
    return <span className="font-semibold text-text-primary">{val}</span>;
  };

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'AI Features', href: '#ai-features' },
    { label: 'WhatsApp', href: '#whatsapp' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <div className="bg-surface-bg text-text-primary min-h-screen selection:bg-accent/20 selection:text-accent font-sans">

      {/* ── Navigation ─────────────────────────────────── */}
      <header className="border-b border-border-default sticky top-0 bg-surface-card/90 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white">
                <Globe className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-text-primary">
                Lead<span className="text-accent">Sphere</span>
              </span>
            </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-1">
            <ThemeToggle />
            <Link href="/console" className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link href="/console" className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all hover-lift">
              Start Free Trial
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-text-secondary">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border-default bg-surface-card px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-text-secondary hover:text-text-primary">{link.label}</a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">Theme</span>
                <ThemeToggle />
              </div>
              <Link href="/console" className="text-sm font-semibold text-center text-text-secondary border border-border-default rounded-lg py-2">Sign In</Link>
              <Link href="/console" className="text-sm font-semibold text-center bg-accent text-white rounded-lg py-2">Start Free Trial</Link>
            </div>
          </div>
        )}
      </header>

      <main>

        {/* ── 1. Hero ──────────────────────────────────── */}
        <section ref={heroRef} className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Dot grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
              style={{
                backgroundImage: 'radial-gradient(circle, var(--accent) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-gradient" />
            <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-info/5 rounded-full blur-3xl animate-gradient" style={{ animationDelay: '2s' }} />
            {/* Floating orbs */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent/30 animate-orbit" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-info/20 animate-orbit-reverse" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent/20 animate-orbit" style={{ animationDelay: '-2s' }} />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-info/20 animate-orbit-reverse" style={{ animationDelay: '-3s' }} />
            </div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-1.5 bg-accent-light border border-accent/20 rounded-full px-3.5 py-1 animate-fadeInDown">
              <Globe className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-accent">AI-Powered CRM for Indian SMEs</span>
            </div>

            <div className="relative max-w-3xl mx-auto">
              <div className="absolute -inset-x-8 -inset-y-4 rounded-3xl bg-gradient-to-r from-accent/5 via-transparent to-accent/5 dark:from-accent/10 dark:via-transparent dark:to-accent/10 blur-2xl pointer-events-none" />
              <div className="absolute -inset-x-4 inset-y-0 rounded-2xl bg-gradient-to-b from-accent/[0.02] to-transparent dark:from-accent/[0.05] dark:to-transparent pointer-events-none" />
              <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                <span className="bg-gradient-to-r from-text-primary via-accent to-text-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                  Turn conversations
                </span>
                <br />
                <span className="text-accent">into customers</span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              LeadSphere brings your conversations, leads, pipeline, and team into one workspace.
              AI handles the follow-ups. You close the deals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <Link href="/console" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm hover-lift">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#features" className="inline-flex items-center gap-2 border border-border-default text-text-secondary hover:text-text-primary font-semibold px-6 py-3 rounded-xl transition-all text-sm hover-lift">
                See Features
              </Link>
            </div>

            <p className="text-sm text-text-muted animate-fadeInUp" style={{ animationDelay: '0.4s' }}>No credit card required &bull; 14-day free trial</p>
          </div>

          {/* Animated stats bar */}
          <div className="relative z-10 mt-12 flex items-center justify-center gap-8 md:gap-16 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            {[
              { label: 'Active Users', value: '5,000+' },
              { label: 'Deals Tracked', value: '₹240Cr+' },
              { label: 'Avg. Conversion', value: '2.4x' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent">{stat.value}</div>
                <div className="text-xs text-text-muted font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Hero visual / dashboard preview */}
          <div className="relative mt-16 mx-auto max-w-5xl animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            {/* Floating widgets */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-accent/10 rounded-2xl border border-accent/20 flex items-center justify-center animate-float hidden md:flex" style={getParallaxOffset(12)}>
              <MessageSquare className="w-8 h-8 text-accent" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-info/10 rounded-2xl border border-info/20 flex items-center justify-center animate-float-delayed hidden md:flex" style={getParallaxOffset(-10)}>
              <BarChart3 className="w-6 h-6 text-info" />
            </div>
            <div className="absolute top-1/3 -right-8 w-14 h-14 bg-success/10 rounded-2xl border border-success/20 flex items-center justify-center animate-float hidden md:flex" style={{ ...getParallaxOffset(8), animationDelay: '2s' }}>
              <Users className="w-6 h-6 text-success" />
            </div>

            <div className="bg-surface-card border border-border-default rounded-2xl shadow-card overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border-default bg-surface-bg/50">
                <div className="w-2.5 h-2.5 rounded-full bg-error/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-warning/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-success/70" />
                <span className="text-xs text-text-muted ml-2 font-medium">LeadSphere — Inbox</span>
              </div>
              <div className="grid grid-cols-3 h-72 md:h-96">
                <div className="col-span-1 border-r border-border-default p-3 space-y-2 bg-surface-bg/30">
                  {['Rajesh Patel', 'Priya Sharma', 'Amit Kumar', 'Sunil Reddy'].map((name, i) => (
                    <div key={name} className={`flex items-center gap-2.5 p-2 rounded-lg ${i === 0 ? 'bg-accent-light/50' : 'hover:bg-surface-bg-alt'} transition-colors`}>
                      <div className="w-7 h-7 rounded-full bg-surface-bg-alt flex items-center justify-center text-[9px] font-bold text-text-secondary">{name.split(' ').map(n => n[0]).join('')}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold text-text-primary truncate">{name}</div>
                        <div className="text-[9px] text-text-muted truncate">{['Shared specs PDF', 'Sent quote', 'Asked about pricing', 'Confirmed demo'][i]}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-span-2 p-4 flex flex-col justify-between bg-surface-card">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-surface-bg-alt flex items-center justify-center text-[8px] font-bold text-text-secondary shrink-0">RP</div>
                      <div className="bg-surface-bg-alt rounded-2xl rounded-tl-none px-3 py-2 max-w-[80%]">
                        <p className="text-xs text-text-primary">Can you share the steel plate specs PDF and delivery timeline?</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 justify-end">
                      <div className="bg-accent rounded-2xl rounded-tr-none px-3 py-2 max-w-[80%]">
                        <p className="text-xs text-white">Sure! Here is the ASTM A36 specification sheet. Delivery within 7 working days.</p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[8px] font-bold text-white shrink-0">AM</div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[8px] font-bold text-accent shrink-0">
                        <Bot className="w-3 h-3" />
                      </div>
                      <div className="border border-accent/20 bg-accent-light/30 rounded-2xl rounded-tl-none px-3 py-2 max-w-[80%]">
                        <p className="text-xs text-text-primary">Suggested reply: &ldquo;Would you like a bulk discount for orders above 50 tons?&rdquo;</p>
                      </div>
                    </div>
                  </div>
                  <div className="border border-border-default rounded-xl px-3 py-2.5 text-xs text-text-muted">Type a message...</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Trusted By ─────────────────────────────── */}
        <section className="border-y border-border-default bg-surface-card">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <p className="text-xs font-semibold text-text-muted text-center uppercase tracking-wider mb-6 reveal">Trusted by 5,000+ growing businesses across India</p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 reveal">
              {['TATA MOTORS', 'RELIANCE', 'GODREJ', 'MARUTI', 'HALDIRAMS'].map((brand) => (
                <span key={brand} className="text-sm font-bold text-text-secondary tracking-wider opacity-60 hover:opacity-100 transition-opacity duration-200">{brand}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Problem Section ────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center mb-14 space-y-4 reveal">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent-light px-3 py-1 rounded-full">The Problem</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Why leads slip through the cracks</h2>
            <p className="text-text-secondary text-lg">Your customers reach out across channels. But nothing talks to each other.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {problems.map((p, i) => (
              <div key={p.title} className={`bg-surface-card border border-border-default rounded-xl p-5 space-y-2 hover-card reveal reveal-delay-${i + 1}`}>
                <div className="w-8 h-8 rounded-lg bg-error-light flex items-center justify-center">
                  <X className="w-4 h-4 text-error" />
                </div>
                <h3 className="text-sm font-bold text-text-primary">{p.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Features ───────────────────────────────── */}
        <section id="features" className="border-t border-border-default bg-surface-card">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="max-w-2xl mx-auto text-center mb-14 space-y-4 reveal">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent-light px-3 py-1 rounded-full">Core CRM</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Everything you need to sell, in one sphere</h2>
              <p className="text-text-secondary text-lg">Not bloated. Just the right tools for a small sales team.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className={`border border-border-default rounded-xl p-5 bg-surface-card space-y-3 hover-card reveal`} style={{ transitionDelay: `${i * 80}ms` }}>
                    <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-sm font-bold text-text-primary">{f.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 5. AI Features ────────────────────────────── */}
        <section id="ai-features" className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center mb-14 space-y-4 reveal">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent-light px-3 py-1 rounded-full">AI-Powered</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Your team has an AI copilot</h2>
            <p className="text-text-secondary text-lg">Not a chatbot. An actual sales assistant that understands your business.</p>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {aiFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="bg-sidebar text-white border border-sidebar-hover rounded-xl p-5 space-y-3 hover:bg-sidebar-hover transition-all duration-200 hover-lift reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-sm font-bold text-white">{f.title}</h3>
                    <p className="text-xs text-sidebar-text leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
        </section>

        {/* ── 6. WhatsApp Features ──────────────────────── */}
        <section id="whatsapp" className="border-t border-border-default bg-surface-card">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="max-w-2xl mx-auto text-center mb-14 space-y-4 reveal">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent-light px-3 py-1 rounded-full">WhatsApp First</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Built for WhatsApp, not bolted on</h2>
              <p className="text-text-secondary text-lg">Unlike other CRMs, WhatsApp is at the center of everything.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {whatsAppFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="border border-border-default rounded-xl p-5 bg-surface-card space-y-3 hover-card reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                    <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-sm font-bold text-text-primary">{f.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 bg-accent/5 border border-accent/20 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto text-center space-y-4 reveal">
              <MessageSquare className="w-8 h-8 text-accent mx-auto" />
              <p className="text-base md:text-lg text-text-primary font-semibold max-w-xl mx-auto">
                &ldquo;Our WhatsApp reply rate is <span className="text-accent">82%</span>. Emails? Less than <span className="text-text-secondary">20%</span>. Your customers are on WhatsApp. So are we.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* ── 7. Pricing ────────────────────────────────── */}
        <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4 reveal">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent-light px-3 py-1 rounded-full">Simple Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Plans that grow with you</h2>
            <p className="text-text-secondary text-lg">No hidden fees. Upgrade, downgrade, or cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">

            {/* Starter */}
            <div className="bg-surface-card border border-border-default rounded-2xl p-6 flex flex-col hover-lift relative reveal" style={{ transitionDelay: '80ms' }}>
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Starter</h4>
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-text-primary">₹1,499</span>
                    <span className="text-xs text-text-secondary font-medium">/month</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">For small teams getting started</p>
                </div>
                <div className="space-y-2.5 text-xs">
                  {[
                    '3 Users',
                    'Leads & Contacts',
                    'Accounts & Deals',
                    'Tasks, Meetings & Calls',
                    'WhatsApp Integration',
                    'Email Integration',
                    'Basic Reports',
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-text-secondary font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/console" className="mt-8 w-full py-2.5 rounded-xl font-semibold text-xs text-center border border-border-default text-text-primary hover:bg-surface-bg-alt transition-colors">
                Start Free Trial
              </Link>
            </div>

            {/* Growth */}
            <div className="bg-surface-card border-2 border-accent rounded-2xl p-6 flex flex-col hover-lift relative scale-[1.02] z-10 reveal" style={{ transitionDelay: '160ms' }}>
              <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] animate-gradient" />
              </div>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Most Popular
              </div>
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Growth</h4>
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-text-primary">₹3,999</span>
                    <span className="text-xs text-text-secondary font-medium">/month</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">For growing sales teams</p>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 py-1">
                    <span className="text-[10px] font-bold text-accent bg-accent-light px-2 py-0.5 rounded">Everything in Starter, plus:</span>
                  </div>
                  {[
                    '10 Users',
                    'Shared Team Inbox',
                    'AI Follow-up Suggestions',
                    'AI Lead Scoring',
                    'Automations & Workflows',
                    'Advanced Reports',
                    '10,000 Contacts',
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-text-primary font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/console" className="mt-8 w-full py-2.5 rounded-xl font-semibold text-xs text-center bg-accent text-white hover:bg-accent-hover transition-all shadow-card hover-lift">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-surface-card border border-border-default rounded-2xl p-6 flex flex-col hover-lift relative reveal" style={{ transitionDelay: '240ms' }}>
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Pro</h4>
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-text-primary">₹7,999</span>
                    <span className="text-xs text-text-secondary font-medium">/month</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">For scaling businesses</p>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 py-1">
                    <span className="text-[10px] font-bold text-text-secondary bg-surface-bg-alt px-2 py-0.5 rounded">Everything in Growth, plus:</span>
                  </div>
                  {[
                    '25 Users',
                    'AI Call Summaries',
                    'AI Meeting Summaries',
                    'API Access',
                    'White Label',
                    'Advanced AI Features',
                    'Unlimited Contacts',
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-text-primary font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/console" className="mt-8 w-full py-2.5 rounded-xl font-semibold text-xs text-center border border-border-default text-text-primary hover:bg-surface-bg-alt transition-colors">
                Start Scaling
              </Link>
            </div>

          </div>

          {/* Comparison Table */}
          <div className="mt-16 max-w-3xl mx-auto reveal">
            <h3 className="text-sm font-bold text-text-primary text-center mb-6">Full feature comparison</h3>
            <div className="bg-surface-card border border-border-default rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border-default bg-surface-bg">
                    <th className="text-left px-4 py-3 font-semibold text-text-primary">Feature</th>
                    <th className="text-center px-3 py-3 font-semibold text-text-secondary">Starter</th>
                    <th className="text-center px-3 py-3 font-semibold text-accent">Growth</th>
                    <th className="text-center px-3 py-3 font-semibold text-text-secondary">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {[
                    { name: 'Users', s: '3', g: '10', p: '25' },
                    { name: 'Contacts', s: '1,000', g: '10,000', p: 'Unlimited' },
                    { name: 'Leads & Deals', s: true, g: true, p: true },
                    { name: 'Tasks & Meetings', s: true, g: true, p: true },
                    { name: 'WhatsApp Integration', s: true, g: true, p: true },
                    { name: 'Email Integration', s: true, g: true, p: true },
                    { name: 'Basic Reports', s: true, g: true, p: true },
                    { name: 'Shared Team Inbox', s: false, g: true, p: true },
                    { name: 'AI Follow-up Suggestions', s: false, g: true, p: true },
                    { name: 'AI Lead Scoring', s: false, g: true, p: true },
                    { name: 'Automations & Workflows', s: false, g: true, p: true },
                    { name: 'Advanced Reports', s: false, g: true, p: true },
                    { name: 'AI Call Summaries', s: false, g: false, p: true },
                    { name: 'AI Meeting Summaries', s: false, g: false, p: true },
                    { name: 'API Access', s: false, g: false, p: true },
                    { name: 'White Label', s: false, g: false, p: true },
                    { name: 'Advanced AI Features', s: false, g: false, p: true },
                  ].map((row) => (
                    <tr key={row.name} className="hover:bg-surface-bg-alt transition-colors">
                      <td className="px-4 py-2.5 font-medium text-text-primary">{row.name}</td>
                      <td className="text-center px-3 py-2.5">{renderCell(row.s)}</td>
                      <td className="text-center px-3 py-2.5 bg-accent-light/20">{renderCell(row.g)}</td>
                      <td className="text-center px-3 py-2.5">{renderCell(row.p)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-muted text-center mt-4">All plans include a 14-day free trial. No credit card required.</p>
          </div>
        </section>

        {/* ── 8. Testimonials ───────────────────────────── */}
        <section id="testimonials" className="border-t border-border-default bg-surface-card">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="max-w-2xl mx-auto text-center mb-14 space-y-4 reveal">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent-light px-3 py-1 rounded-full">Testimonials</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Trusted by SME owners like you</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div key={t.name} className="bg-surface-card border border-border-default rounded-xl p-6 space-y-4 hover-card reveal" style={{ transitionDelay: `${idx * 100}ms` }}>
                  <Quote className="w-6 h-6 text-accent/30" />
                  <p className="text-sm text-text-secondary leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="pt-2 border-t border-border-default">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-xs font-bold text-accent">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-text-primary">{t.name}</div>
                        <div className="text-[10px] text-text-muted">{t.role}, {t.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. FAQ ────────────────────────────────────── */}
        <section id="faq" className="max-w-3xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center mb-14 space-y-4 reveal">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent-light px-3 py-1 rounded-full">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-surface-card border border-border-default rounded-xl overflow-hidden reveal" style={{ transitionDelay: `${idx * 50}ms` }}>
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-5 py-4 text-sm font-semibold text-text-primary flex justify-between items-center"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-text-muted transition-transform duration-200 ${faqOpen === idx ? 'rotate-90' : ''}`} />
                </button>
                {faqOpen === idx && (
                  <div className="px-5 pb-4 pt-0 text-sm text-text-secondary leading-relaxed border-t border-border-default mt-0">
                    <div className="pt-3">{faq.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── 10. CTA ───────────────────────────────────── */}
        <section className="bg-sidebar border-t border-sidebar-hover relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-gradient" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 md:py-28 text-center space-y-6 reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Ready to turn conversations into customers?</h2>
            <p className="text-lg text-sidebar-text max-w-xl mx-auto leading-relaxed">
              Join 5,000+ Indian SMEs using LeadSphere to capture, nurture, and close more deals — right from WhatsApp and beyond.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/console" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm hover-lift">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#features" className="inline-flex items-center gap-2 border border-sidebar-hover text-sidebar-text hover:text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm hover-lift">
                See How It Works
              </Link>
            </div>
            <p className="text-sm text-sidebar-text-muted">No credit card required &bull; 14-day free trial &bull; Cancel anytime</p>
          </div>
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-border-default bg-surface-card py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-white">
                <Globe className="w-3 h-3" />
              </div>
            <span className="text-xs font-bold text-text-primary">LeadSphere</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-text-muted">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact</span>
          </div>
          <p className="text-xs text-text-muted">&copy; {new Date().getFullYear()} LeadSphere. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

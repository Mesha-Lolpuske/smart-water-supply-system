import React from "react";
import {useNavigate} from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  Bell,
  BarChart3,
  Eye,
  Zap,
  Leaf,
  ShieldCheck,
  Facebook,
  Twitter,
  Linkedin,
  Droplets,
  ArrowRight,
} from "lucide-react";

function Homepage() {
  const navigate = useNavigate()
  const contactCards = [
    {
      icon: Phone,
      title: "Phone",
      value: "+2547098765",
      sub: "Mon-Fri: 9am-6pm EST",
    },
    {
      icon: Mail,
      title: "Email",
      value: "support@majitrack.com",
      sub: "contact@majitrack.com",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "MajiTrack HQ",
      sub: "123 Water Street, Tech City, TC 12345",
    },
  ];

  const features = [
    {
      icon: Calendar,
      title: "Schedule Tracking",
      desc: "Get precise water distribution schedules and never miss updates",
      color: "sky",
    },
    {
      icon: AlertTriangle,
      title: "Emergency Reporting",
      desc: "Report leaks, contamination, and outages in seconds",
      color: "orange",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      desc: "Instant notifications about supply changes and maintenance",
      color: "purple",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      desc: "Deep insights into consumption patterns and system health",
      color: "emerald",
    },
  ];

  const footerLinks = [
    {
      title: "Features",
      links: [
        "Real-time Tracking",
        "Emergency Reports",
        "Smart Alerts",
        "Analytics",
      ],
    },
    { title: "Company", links: ["About Us", "Blog", "Careers", "Press"] },
    {
      title: "Support",
      links: ["Help Center", "Contact Us", "Status Page", "Documentation"],
    },
    {
      title: "Legal",
      links: [
        "Privacy Policy",
        "Terms of Service",
        "Cookie Policy",
        "Compliance",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-blue-950 scroll-smooth">
      {/* Navigation header */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b-2 shadow-lg border-sky-400/30 backdrop-blur-md bg-gradient-to-r from-blue-950/95 to-blue-900/95 shadow-blue-950/50">
        <div className="flex items-center gap-4">
          <a
            href="#home"
            className="flex items-center gap-4 transition-transform duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-center transition-transform duration-300 rounded-full shadow-lg w-14 h-14 bg-gradient-to-br from-sky-300 to-sky-400 shadow-sky-400/50 hover:scale-110">
              <Droplets className="text-blue-900" size={28} />
            </div>
            <div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-sky-200">
                MajiTrack
              </span>
              <p className="text-xs font-medium text-sky-300/80">
                Smart Water Management
              </p>
            </div>
          </a>
        </div>
        <div className="flex items-center gap-8">
          <a
            href="#features"
            className="relative text-sm font-semibold text-blue-100 transition duration-300 hover:text-sky-300 group"
          >
            Features
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-400 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a
            href="#about"
            className="relative text-sm font-semibold text-blue-100 transition duration-300 hover:text-sky-300 group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-400 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a
            href="#contact"
            className="relative text-sm font-semibold text-blue-100 transition duration-300 hover:text-sky-300 group"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-400 group-hover:w-full transition-all duration-300"></span>
          </a>
          <div className="w-px h-6 bg-sky-400/30"></div>
          <button  onClick={() => navigate('/login')} className="px-6 py-2.5 font-semibold transition-all duration-300 rounded-lg text-blue-950 bg-gradient-to-r from-sky-300 to-sky-200 hover:shadow-lg hover:shadow-sky-400/50 hover:scale-105 active:scale-95 relative overflow-hidden group">
            <span className="relative z-10 ">Login</span>
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-sky-400 to-sky-300 group-hover:opacity-100 -z-10"></div>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        id="home"
        className="relative z-10 min-h-[90vh] flex items-center bg-blue-950 overflow-hidden"
      >
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sky-500/5 to-transparent"></div>
        
        <div className="relative z-10 grid items-center w-full gap-12 px-8 py-20 mx-auto max-w-7xl lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold tracking-widest uppercase border rounded-lg text-sky-400 border-sky-400/20 bg-sky-400/5">
              <Droplets size={14} />
              <span>Enterprise Solutions</span>
            </div>
            
            <h1 className="text-6xl font-black leading-[1.1] text-white lg:text-7xl">
              Smart Water <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400">
                Infrastructure.
              </span>
            </h1>

            <p className="max-w-xl text-lg font-medium leading-relaxed text-blue-100/60 md:text-xl">
              Streamline distribution, monitor real-time health, and empower 
              communities with our unified water management platform.
            </p>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <button 
                onClick={() => navigate('/login')} 
                className="flex items-center justify-center gap-2 px-8 py-4 font-bold transition-all duration-300 shadow-lg rounded-xl text-blue-950 bg-sky-300 hover:bg-sky-200 hover:-translate-y-1 shadow-sky-400/20"
              >
                Get Started
                <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 font-bold text-white transition-all duration-300 border-2 bg-white/5 rounded-xl border-white/10 hover:bg-white/10">
                View Demo
              </button>
            </div>
          </div>

          {/* Right Side: Clean Feature Stack */}
          <div className="relative">
            <div className="space-y-6 lg:ml-auto lg:max-w-md">
              {[
                { icon: Eye, title: "Real-time Monitoring", desc: "Live tracking of system flow and pressure.", color: "text-sky-400" },
                { icon: Bell, title: "Smart Alerts", desc: "Automated notifications for supply changes.", color: "text-purple-400" },
                { icon: ShieldCheck, title: "Secure Analytics", desc: "Enterprise-grade data encryption and insights.", color: "text-emerald-400" },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="group p-6 transition-all duration-300 border bg-white/5 backdrop-blur-md border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-white/5 ${item.color}`}>
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h3 className="mb-1 font-bold text-white">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-blue-100/50">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Decorative Glow */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-sky-500/10 blur-[100px]"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 px-4 py-20 bg-blue-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-4 text-4xl font-bold text-center text-white">
            Key Features
          </h2>
          <p className="mb-16 font-medium text-center text-sky-300">
            Powerful tools to manage every aspect of your water supply
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => {
              const IconComponent = feature.icon;
              const colorMap = {
                sky: {
                  border: "border-sky-400/20",
                  hoverBorder: "hover:border-sky-400/60",
                  shadow: "hover:shadow-sky-400/40",
                  bg: "from-sky-400/10",
                  dot: "bg-sky-400",
                },
                orange: {
                  border: "border-orange-400/20",
                  hoverBorder: "hover:border-orange-400/60",
                  shadow: "hover:shadow-orange-400/40",
                  bg: "from-orange-400/10",
                  dot: "bg-orange-400",
                },
                purple: {
                  border: "border-purple-400/20",
                  hoverBorder: "hover:border-purple-400/60",
                  shadow: "hover:shadow-purple-400/40",
                  bg: "from-purple-400/10",
                  dot: "bg-purple-400",
                },
                emerald: {
                  border: "border-emerald-400/20",
                  hoverBorder: "hover:border-emerald-400/60",
                  shadow: "hover:shadow-emerald-400/40",
                  bg: "from-emerald-400/10",
                  dot: "bg-emerald-400",
                },
              };
              const colors = colorMap[feature.color];
              return (
                <div
                  key={idx}
                  className={`relative p-8 overflow-hidden text-center transition-all duration-300 border-2 rounded-2xl group hover:-translate-y-4 hover:shadow-2xl bg-gradient-to-br from-blue-800 to-blue-900 ${colors.border} ${colors.hoverBorder} ${colors.shadow}`}
                >
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br ${colors.bg} to-blue-400/10 group-hover:opacity-100`}
                  ></div>
                  <div
                    className={`absolute w-2 h-2 rounded-full top-3 right-3 ${colors.dot} group-hover:animate-pulse`}
                  ></div>
                  <div className="relative">
                    <div className="mb-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                      <IconComponent
                        size={48}
                        className="mx-auto text-sky-300"
                      />
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-blue-200">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div
        id="about"
        className="relative z-10 px-4 py-16 bg-gradient-to-b from-blue-950 to-blue-900"
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-4xl font-bold text-white">
              Why Choose MajiTrack?
            </h2>
            <p className="font-medium text-sky-300">
              Transforming water management for modern communities
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Card 1 */}
            <div className="relative p-8 overflow-hidden transition-all duration-300 border-2 group rounded-2xl bg-gradient-to-br from-blue-800 to-blue-900 border-sky-400/20 hover:border-sky-400/60 hover:shadow-2xl hover:shadow-sky-400/40">
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-sky-400/10 to-blue-400/10"></div>
              <div className="relative">
                <Zap size={48} className="mb-4 text-sky-300" />
                <h3 className="mb-3 text-xl font-bold text-white">
                  Real-time Intelligence
                </h3>
                <p className="text-sm text-blue-200">
                  Get instant insights into your water supply system with
                  advanced monitoring technology that never sleeps
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative p-8 overflow-hidden transition-all duration-300 border-2 group rounded-2xl bg-gradient-to-br from-blue-800 to-blue-900 border-sky-400/20 hover:border-sky-400/60 hover:shadow-2xl hover:shadow-sky-400/40">
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-sky-400/10 to-blue-400/10"></div>
              <div className="relative">
                <Leaf size={48} className="mb-4 text-emerald-300" />

                <h3 className="mb-3 text-xl font-bold text-white">
                  Sustainable Solutions
                </h3>
                <p className="text-sm text-blue-200">
                  Help your community reduce water waste and build a sustainable
                  future with intelligent management
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative p-8 overflow-hidden transition-all duration-300 border-2 group rounded-2xl bg-gradient-to-br from-blue-800 to-blue-900 border-sky-400/20 hover:border-sky-400/60 hover:shadow-2xl hover:shadow-sky-400/40">
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-sky-400/10 to-blue-400/10"></div>
              <div className="relative">
                <ShieldCheck size={48} className="mb-4 text-blue-300" />
                <h3 className="mb-3 text-xl font-bold text-white">
                  Reliability Guaranteed
                </h3>
                <p className="text-sm text-blue-200">
                  99.9% uptime with enterprise-grade security ensuring your
                  water system always stays protected
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 mt-12 border-2 rounded-2xl bg-gradient-to-r from-sky-400/10 to-blue-400/10 border-sky-400/30">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <p className="mb-2 text-4xl font-bold text-sky-300">1000+</p>
                <p className="text-sm text-blue-200">
                  Active Communities Trust AquaTrack for their critical water
                  infrastructure
                </p>
              </div>
              <div className="text-center">
                <p className="mb-2 text-4xl font-bold text-sky-300">500M+</p>
                <p className="text-sm text-blue-200">
                  Liters of Water Managed Daily across our global network
                </p>
              </div>
              <div className="text-center">
                <p className="mb-2 text-4xl font-bold text-sky-300">99.9%</p>
                <p className="text-sm text-blue-200">
                  System Uptime guaranteed with 24/7 support and monitoring
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="relative z-10 px-4 py-16 bg-blue-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-4xl font-bold text-white">Get in Touch</h2>
            <p className="max-w-2xl mx-auto font-medium text-sky-300">
              Have questions? We're here to help and answer any questions you
              may have.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Form */}
            <div className="p-8 border-2 rounded-2xl bg-gradient-to-br from-blue-800/80 to-blue-900/80 border-sky-400/30 backdrop-blur">
              <h3 className="mb-6 text-2xl font-bold text-white">
                Send us a Message
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-sky-300">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full p-3 text-white placeholder-blue-300 transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-sky-300">
                    Your Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full p-3 text-white placeholder-blue-300 transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-sky-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="What is this about?"
                    className="w-full p-3 text-white placeholder-blue-300 transition border rounded-lg bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-sky-300">
                    Your Message
                  </label>
                  <textarea
                    placeholder="Write your message here..."
                    rows="5"
                    className="w-full p-3 text-white placeholder-blue-300 transition border rounded-lg resize-none bg-white/10 border-sky-400/30 focus:outline-none focus:border-sky-400"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 font-bold transition-all duration-300 rounded-lg text-blue-950 bg-gradient-to-r from-sky-300 to-sky-200 hover:shadow-2xl hover:shadow-sky-400/50"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {contactCards.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sky-400/20">
                      <IconComponent size={24} className="text-sky-300" />
                    </div>
                    <div>
                      <h4 className="mb-1 text-lg font-semibold text-white">
                        {card.title}
                      </h4>
                      <p className="text-sky-300">{card.value}</p>
                      <p className="text-sm text-blue-200">{card.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-16 border-t-2 border-sky-400/30 bg-gradient-to-b from-blue-950 to-blue-950">
        <div className="absolute top-0 left-0 right-0 h-12 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 Q300,20 600,60 T1200,60 L1200,0 L0,0 Z"
              fill="currentColor"
              className="text-sky-300"
            ></path>
          </svg>
        </div>
        <div className="relative z-10 max-w-6xl px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-5">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-sky-300 to-sky-400">
                  <span className="text-xl">💧</span>
                </div>
                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-sky-200">
                  AquaTrack
                </span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-blue-300">
                Empowering communities with intelligent water management
                solutions for a sustainable future.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex items-center justify-center w-10 h-10 transition rounded-full bg-sky-400/20 hover:bg-sky-400/40 text-sky-300"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-10 h-10 transition rounded-full bg-sky-400/20 hover:bg-sky-400/40 text-sky-300"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-10 h-10 transition rounded-full bg-sky-400/20 hover:bg-sky-400/40 text-sky-300"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
            {footerLinks.map((section, idx) => (
              <div key={idx}>
                <h4 className="mb-4 font-bold text-white">{section.title}</h4>
                <ul className="space-y-3 text-sm text-blue-300">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="font-medium transition hover:text-sky-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-sky-400/20">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-blue-400">
                © 2026 AquaTrack Water Management System. All rights reserved.
              </p>
              <p className="text-sm text-blue-400">
                Made with 💧 for sustainable water futures
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;

import { Link } from "react-router-dom";
import { ArrowRight, Target, Compass } from "lucide-react";

export default function About() {
  return (
    <div className="pb-20">
      {/* Hero Banner */}
      <section className="bg-secondary-900 text-white py-20 px-4 sm:px-6 lg:px-8 mb-16 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-900 rounded-full blur-[100px] opacity-50 mix-blend-screen" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">About PerfXcel</h1>
          <p className="text-xl text-secondary-300">
            Empowering professionals across the EMEA region with world-class, accredited training programs designed for the modern business landscape.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        {/* Our Story */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-primary-600 font-bold tracking-widest uppercase mb-2">Our Story</div>
            <h2 className="text-4xl font-extrabold text-secondary-900 mb-6">A Legacy of Excellence in Corporate Education</h2>
            <div className="space-y-4 text-lg text-secondary-700">
              <p>
                Founded in 2008, PerfXcel began with a simple mission: to bridge the gap between academic theory and practical corporate execution. What started as a small consultancy in Dubai has grown into a premier professional development institute serving the entire EMEA region.
              </p>
              <p>
                Over the past decade, we have partnered with thousands of organisations to upskill their workforce, delivering highly specialised training programs that drive tangible business results and individual career growth.
              </p>
              <p>
                Today, we offer over 1,200 meticulously designed courses spanning finance, leadership, IT, HR, and engineering, all accredited by the world's most prestigious professional bodies.
              </p>
            </div>
          </div>
          
          <div className="glass-panel p-10 rounded-3xl bg-gradient-to-br from-primary-50 to-white border border-primary-100 shadow-xl relative">
            <div className="absolute top-4 right-4 text-primary-200">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900 mb-8">At a Glance</h3>
            <ul className="space-y-6">
              <li className="flex justify-between items-center border-b border-primary-100 pb-4">
                <span className="text-secondary-600 font-medium">Founded</span>
                <span className="text-xl font-bold text-secondary-900">2008</span>
              </li>
              <li className="flex justify-between items-center border-b border-primary-100 pb-4">
                <span className="text-secondary-600 font-medium">Headquarters</span>
                <span className="text-xl font-bold text-secondary-900">Dubai, UAE</span>
              </li>
              <li className="flex justify-between items-center border-b border-primary-100 pb-4">
                <span className="text-secondary-600 font-medium">Training Days / Year</span>
                <span className="text-xl font-bold text-secondary-900">3,000+</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-secondary-600 font-medium">Client Satisfaction</span>
                <span className="text-xl font-bold text-secondary-900">98.5%</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="rounded-3xl p-10 bg-secondary-900 text-white relative overflow-hidden shadow-xl">
            <div className="absolute -bottom-10 -right-10 text-white/5">
              <Target className="w-64 h-64" />
            </div>
            <Target className="w-12 h-12 text-primary-400 mb-6 relative z-10" />
            <h3 className="text-3xl font-bold mb-4 relative z-10">Our Mission</h3>
            <p className="text-lg text-secondary-300 relative z-10">
              To empower professionals and organisations by delivering practical, industry-leading education that drives measurable performance improvements and career advancement.
            </p>
          </div>
          <div className="rounded-3xl p-10 bg-primary-600 text-white relative overflow-hidden shadow-xl">
             <div className="absolute -bottom-10 -right-10 text-white/10">
              <Compass className="w-64 h-64" />
            </div>
            <Compass className="w-12 h-12 text-primary-200 mb-6 relative z-10" />
            <h3 className="text-3xl font-bold mb-4 relative z-10">Our Vision</h3>
            <p className="text-lg text-primary-100 relative z-10">
              To be the globally recognised standard of excellence in corporate training, shaping the future of continuous professional development across the world.
            </p>
          </div>
        </section>

        {/* Our Numbers (Stats grid) */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-secondary-900">Our Impact in Numbers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass-panel text-center p-8 rounded-2xl border border-gray-100">
              <div className="text-4xl font-extrabold text-primary-600 mb-2">1,200+</div>
              <div className="text-sm font-bold text-secondary-500 uppercase tracking-wide">Courses</div>
            </div>
            <div className="glass-panel text-center p-8 rounded-2xl border border-gray-100">
              <div className="text-4xl font-extrabold text-primary-600 mb-2">50k+</div>
              <div className="text-sm font-bold text-secondary-500 uppercase tracking-wide">Alumni</div>
            </div>
            <div className="glass-panel text-center p-8 rounded-2xl border border-gray-100">
              <div className="text-4xl font-extrabold text-primary-600 mb-2">200+</div>
              <div className="text-sm font-bold text-secondary-500 uppercase tracking-wide">Experts</div>
            </div>
            <div className="glass-panel text-center p-8 rounded-2xl border border-gray-100">
              <div className="text-4xl font-extrabold text-primary-600 mb-2">30+</div>
              <div className="text-sm font-bold text-secondary-500 uppercase tracking-wide">Countries</div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section>
          <div className="text-center mb-16">
            <div className="text-primary-600 font-bold tracking-widest uppercase mb-2">Leadership</div>
            <h2 className="text-4xl font-extrabold text-secondary-900">Meet Our Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Khalid Al-Rashid", role: "Chief Executive Officer" },
              { name: "Dr. Sarah Mitchell", role: "Chief Learning Officer" },
              { name: "Tariq Mansoor", role: "VP, Corporate Partnerships" },
              { name: "Elena Rostova", role: "Head of Operations" }
            ].map((leader, i) => (
              <div key={i} className="text-center group">
                <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-primary-100 to-primary-200 mb-6 p-1 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-bold text-primary-500">
                    {leader.name.charAt(0)}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-secondary-900">{leader.name}</h3>
                <p className="text-primary-600 font-medium">{leader.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Accreditations */}
        <section className="bg-secondary-50 py-16 text-center overflow-hidden">
          <h2 className="text-2xl font-bold text-secondary-900 mb-12">Accreditations & Partners</h2>
          
          <div className="relative w-full overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-secondary-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-secondary-50 to-transparent z-10 pointer-events-none"></div>
            
            <div className="animate-marquee hover:pause flex items-center">
              {/* Double array for seamless loop */}
              {[1, 2].map((set) => (
                <div key={set} className="flex gap-12 px-6 items-center shrink-0">
                  {/* PMI */}
                  <div className="bg-white px-8 py-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center w-48 h-20 shrink-0">
                    <svg viewBox="0 0 100 40" className="h-10 w-full max-w-[100px]">
                      <circle cx="20" cy="20" r="16" fill="#1e3a8a"/>
                      <text x="20" y="25" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle">P</text>
                      <text x="45" y="26" fill="#1e3a8a" fontSize="22" fontWeight="900">PMI</text>
                    </svg>
                  </div>
                  
                  {/* CIPD */}
                  <div className="bg-white px-8 py-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center w-48 h-20 shrink-0">
                    <svg viewBox="0 0 100 40" className="h-10 w-full max-w-[100px]">
                      <rect x="0" y="8" width="24" height="24" rx="4" fill="#0369a1"/>
                      <text x="35" y="26" fill="#0369a1" fontSize="22" fontWeight="800">CIPD</text>
                    </svg>
                  </div>
                  
                  {/* ILM */}
                  <div className="bg-white px-8 py-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center w-48 h-20 shrink-0">
                    <svg viewBox="0 0 100 40" className="h-10 w-full max-w-[100px]">
                      <path d="M0 20 Q 10 0 20 20 T 40 20" stroke="#0f766e" strokeWidth="4" fill="none"/>
                      <text x="45" y="26" fill="#0f766e" fontSize="22" fontWeight="800">ILM</text>
                    </svg>
                  </div>
                  
                  {/* CIMA */}
                  <div className="bg-white px-8 py-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center w-48 h-20 shrink-0">
                    <svg viewBox="0 0 110 40" className="h-10 w-full max-w-[110px]">
                      <rect x="0" y="0" width="110" height="40" fill="#334155" rx="4"/>
                      <text x="55" y="26" fill="#fff" fontSize="18" fontWeight="700" letterSpacing="2" textAnchor="middle">CIMA</text>
                    </svg>
                  </div>
                  
                  {/* ISO 9001 */}
                  <div className="bg-white px-8 py-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center w-48 h-20 shrink-0">
                    <svg viewBox="0 0 130 40" className="h-10 w-full max-w-[130px]">
                      <circle cx="20" cy="20" r="14" stroke="#be123c" strokeWidth="4" fill="none"/>
                      <text x="45" y="26" fill="#be123c" fontSize="20" fontWeight="900">ISO 9001</text>
                    </svg>
                  </div>
                  
                  {/* SHRM */}
                  <div className="bg-white px-8 py-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center w-48 h-20 shrink-0">
                    <svg viewBox="0 0 100 40" className="h-10 w-full max-w-[100px]">
                      <polygon points="20,5 35,35 5,35" fill="#4338ca"/>
                      <text x="45" y="26" fill="#4338ca" fontSize="22" fontWeight="900">SHRM</text>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-gradient-to-r from-secondary-900 to-secondary-800 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 relative z-10">Ready to invest in your future?</h2>
          <p className="text-xl text-secondary-300 mb-10 max-w-2xl mx-auto relative z-10">
            Join thousands of professionals who have accelerated their careers with PerfXcel.
          </p>
          <Link to="/courses" className="inline-flex relative z-10 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-colors">
            Browse All Courses <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </section>
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { useTaxonomies } from "../hooks/useTaxonomies";

export default function Navbar() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { taxonomies, loading, error } = useTaxonomies();

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setIsMegaMenuOpen(false), 150);
  };

  const handleLinkClick = () => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" onClick={handleLinkClick} className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="PerfXcel Logo"
              className="h-10 w-10 object-contain shadow-lg rounded-full"
            />
            <span className="font-bold text-2xl tracking-tight text-secondary-900">
              Perfxcel<span className="text-primary-600">LMS</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8 h-full">
            <li>
              <Link to="/" onClick={handleLinkClick} className="text-secondary-800 hover:text-primary-600 font-medium transition-colors">
                Home
              </Link>
            </li>
            <li
              className="relative h-full flex items-center cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span className={`flex items-center text-secondary-800 hover:text-primary-600 font-medium transition-colors ${isMegaMenuOpen ? 'text-primary-600' : ''}`}>
                Courses <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </span>

              {/* Mega Menu Panel */}
              {isMegaMenuOpen && (
                <div 
                  className={`absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-5xl bg-white shadow-2xl rounded-2xl border border-gray-100 p-8 mega-menu-enter ${isMegaMenuOpen ? 'open' : ''}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid grid-cols-4 gap-8">
                    {/* By Category */}
                    <div>
                      <h4 className="font-bold text-secondary-900 border-b-2 border-primary-600 pb-2 mb-4 inline-block">By Category</h4>
                      <ul className="space-y-3">
                        {loading ? (
                          <>
                            <li className="animate-pulse bg-secondary-100 h-4 rounded w-3/4"></li>
                            <li className="animate-pulse bg-secondary-100 h-4 rounded w-1/2"></li>
                            <li className="animate-pulse bg-secondary-100 h-4 rounded w-5/6"></li>
                          </>
                        ) : error ? (
                          <li className="text-red-500 text-sm">Failed to load</li>
                        ) : (
                          taxonomies?.categories?.slice(0, 8).map((cat) => (
                            <li key={cat.id}>
                              <Link 
                                to={`/courses?category=${cat.id}`} 
                                onClick={handleLinkClick}
                                className="text-secondary-600 hover:text-primary-600 hover:pl-1 transition-all block text-sm"
                              >
                                {cat.name}
                              </Link>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>

                    {/* By Location */}
                    <div>
                      <h4 className="font-bold text-secondary-900 border-b-2 border-primary-600 pb-2 mb-4 inline-block">By Location</h4>
                      <ul className="space-y-3">
                        {loading ? (
                          <>
                            <li className="animate-pulse bg-secondary-100 h-4 rounded w-3/4"></li>
                            <li className="animate-pulse bg-secondary-100 h-4 rounded w-1/2"></li>
                            <li className="animate-pulse bg-secondary-100 h-4 rounded w-5/6"></li>
                          </>
                        ) : error ? (
                          <li className="text-red-500 text-sm">Failed to load</li>
                        ) : (
                          taxonomies?.cities?.slice(0, 8).map((city) => (
                            <li key={city.id}>
                              <Link 
                                to={`/courses?location=${city.id}`} 
                                onClick={handleLinkClick}
                                className="text-secondary-600 hover:text-primary-600 hover:pl-1 transition-all block text-sm"
                              >
                                {city.name}
                              </Link>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>

                    {/* By Association */}
                    <div>
                      <h4 className="font-bold text-secondary-900 border-b-2 border-primary-600 pb-2 mb-4 inline-block">By Association</h4>
                      <ul className="space-y-3">
                        {loading ? (
                          <>
                            <li className="animate-pulse bg-secondary-100 h-4 rounded w-3/4"></li>
                            <li className="animate-pulse bg-secondary-100 h-4 rounded w-1/2"></li>
                            <li className="animate-pulse bg-secondary-100 h-4 rounded w-5/6"></li>
                          </>
                        ) : error ? (
                          <li className="text-red-500 text-sm">Failed to load</li>
                        ) : (
                          taxonomies?.associations?.slice(0, 8).map((assoc) => (
                            <li key={assoc.id}>
                              <Link 
                                to={`/courses?association=${assoc.id}`} 
                                onClick={handleLinkClick}
                                className="text-secondary-600 hover:text-primary-600 hover:pl-1 transition-all block text-sm"
                              >
                                {assoc.name}
                              </Link>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>

                    {/* By Delivery Type */}
                    <div>
                      <h4 className="font-bold text-secondary-900 border-b-2 border-primary-600 pb-2 mb-4 inline-block">By Delivery Type</h4>
                      <ul className="space-y-3">
                        <li>
                          <Link to="/courses?delivery=online" onClick={handleLinkClick} className="text-secondary-600 hover:text-primary-600 hover:pl-1 transition-all block text-sm">
                            Online
                          </Link>
                        </li>
                        <li>
                          <Link to="/courses?delivery=in-person" onClick={handleLinkClick} className="text-secondary-600 hover:text-primary-600 hover:pl-1 transition-all block text-sm">
                            In-Person Classroom
                          </Link>
                        </li>
                        <li>
                          <Link to="/courses?delivery=corporate" onClick={handleLinkClick} className="text-secondary-600 hover:text-primary-600 hover:pl-1 transition-all block text-sm">
                            Corporate / In-House
                          </Link>
                        </li>
                        <li>
                          <Link to="/courses?delivery=blended" onClick={handleLinkClick} className="text-secondary-600 hover:text-primary-600 hover:pl-1 transition-all block text-sm">
                            Blended Learning
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                    <Link 
                      to="/courses" 
                      onClick={handleLinkClick}
                      className="text-primary-600 font-bold hover:text-primary-700 flex items-center gap-2 group"
                    >
                      View All Courses <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link to="/about" onClick={handleLinkClick} className="text-secondary-800 hover:text-primary-600 font-medium transition-colors">
                About
              </Link>
            </li>
          </ul>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link 
              to="/courses" 
              onClick={handleLinkClick}
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Browse All Courses <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <button className="md:hidden text-secondary-800 p-2" onClick={handleMobileMenuToggle}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-xl border-t border-gray-100 h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link to="/" onClick={handleLinkClick} className="block px-3 py-4 text-base font-bold text-secondary-900 border-b border-gray-100">
              Home
            </Link>
            
            <div className="px-3 py-4 border-b border-gray-100">
              <span className="block text-base font-bold text-secondary-900 mb-4">Courses</span>
              
              <div className="space-y-4 pl-4 border-l-2 border-primary-100">
                <div>
                  <div className="text-sm font-semibold text-secondary-500 uppercase tracking-wider mb-2">By Category</div>
                  {taxonomies?.categories?.map(c => (
                    <Link key={c.id} to={`/courses?category=${c.id}`} onClick={handleLinkClick} className="block py-1.5 text-secondary-700">
                      {c.name}
                    </Link>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-semibold text-secondary-500 uppercase tracking-wider mb-2">By Delivery Type</div>
                  <Link to="/courses?delivery=online" onClick={handleLinkClick} className="block py-1.5 text-secondary-700">Online</Link>
                  <Link to="/courses?delivery=in-person" onClick={handleLinkClick} className="block py-1.5 text-secondary-700">In-Person</Link>
                </div>
                <Link to="/courses" onClick={handleLinkClick} className="block py-2 text-primary-600 font-bold">
                  View All Courses →
                </Link>
              </div>
            </div>

            <Link to="/about" onClick={handleLinkClick} className="block px-3 py-4 text-base font-bold text-secondary-900 border-b border-gray-100">
              About
            </Link>
            
            <div className="pt-6 px-3">
              <Link to="/courses" onClick={handleLinkClick} className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700">
                Browse All Courses
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

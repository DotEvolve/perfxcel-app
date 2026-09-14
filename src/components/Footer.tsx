import { Link } from "react-router-dom";
import { Linkedin, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Col 1: Brand */}
        <div>
          <Link to="/" className="flex items-center space-x-3 mb-6">
            <img
              src="/logo.png"
              alt="PerfXcel Logo"
              className="h-10 w-10 object-contain shadow-lg rounded-full"
            />
            <span className="font-bold text-2xl tracking-tight text-white">
              PerfXcel
            </span>
          </Link>
          <p className="mb-6">
            Empowering professionals across the EMEA region with world-class, accredited training programs.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary-500 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-primary-500 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-primary-500 transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
          <ul className="space-y-3">
            <li>
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-white transition-colors">All Courses</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            </li>
            <li>
              <a href="#contact" className="hover:text-white transition-colors">Contact Us</a>
            </li>
          </ul>
        </div>

        {/* Col 3: Training Delivery */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Training Delivery</h4>
          <ul className="space-y-3">
            <li>
              <Link to="/courses?delivery=online" className="hover:text-white transition-colors">Online</Link>
            </li>
            <li>
              <Link to="/courses?delivery=in-person" className="hover:text-white transition-colors">In-Person Classroom</Link>
            </li>
            <li>
              <Link to="/courses?delivery=corporate" className="hover:text-white transition-colors">Corporate / In-House</Link>
            </li>
            <li>
              <Link to="/courses?delivery=blended" className="hover:text-white transition-colors">Blended Learning</Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Get in Touch</h4>
          <address className="not-italic space-y-3">
            <p>Dubai, United Arab Emirates</p>
            <p>
              <a href="mailto:info@perfxcel.com" className="hover:text-white transition-colors">
                info@perfxcel.com
              </a>
            </p>
            <p>
              <a href="tel:+97141234567" className="hover:text-white transition-colors">
                +971 4 123 4567
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <p className="mb-4 md:mb-0">
          &copy; 2026 PerfXcel by DotEvolve. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

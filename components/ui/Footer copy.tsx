import { Facebook, Youtube, Instagram, Linkedin } from "lucide-react";
import oxfordLogo from "@/assets/oxford-university-press-logo.png";

const Footer = () => {
  const currentDate = new Date().toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <footer className="bg-[#002147] text-white py-6 px-8">
      <div className="max-w-full">
        {/* Top Section */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src={oxfordLogo} alt="Oxford University Press" className="h-10" />
          </div>

          {/* Navigation Links */}
          <nav className="flex gap-8 flex-wrap">
            <a href="#" className="text-white hover:text-gray-300 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors text-sm">
              Legal Policy
            </a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors text-sm">
              Cookies Policy
            </a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors text-sm">
              System Requirements
            </a>
          </nav>

          {/* Social Icons */}
          <div className="flex gap-3">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-[#002147]" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5 text-[#002147]" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-[#002147]" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-[#002147]" />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between text-xs text-white/90 flex-wrap gap-2">
          <div>
            Copyright © {new Date().getFullYear()} Oxford University Press | All rights reserved
          </div>
          <div>
            Server date and time: {currentDate} | Application Version: 8.0.0
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

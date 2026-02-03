import { Facebook, Youtube, Instagram, Linkedin } from "lucide-react";
import { useState } from "react";
import oxfordLogo from "@/assets/oxford-university-press-logo.png";

const Footer = ({ className = "" }: { className?: string }) => {
  const [showSystemRequirements, setShowSystemRequirements] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);

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
    <footer className={`bg-[#002147] text-white py-2 w-full ${className}`}>
      <div className="w-full px-3">
        <div className="flex flex-col md:flex-row items-start md:items-center py-4 gap-2 md:gap-4 lg:gap-6 xl:gap-8">
          {/* Logo - Fixed on the left */}
          <div className="flex-shrink-0">
            <img src={oxfordLogo} alt="Oxford University Press" className="h-13" />
          </div>
          
          {/* Navigation Links - Center aligned */}
          <nav className="flex-1 ml-5 flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 lg:gap-5">
             <a 
              href="https://global.oup.com/childrens-privacy-notice?cc=gb" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white text-sm hover:text-gray-300 transition-colors"
            >
              Children Privacy Policy
            </a>
            <a 
              href="https://corp.oup.com/privacy-policy/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white text-sm hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="https://india.oup.com/Legal-policy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white text-sm hover:text-gray-300 transition-colors"
            >
              Legal Policy
            </a>
            <a 
              href="https://corp.oup.com/cookie-policy/"  
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white text-sm hover:text-gray-300 transition-colors"
            >
              Cookies Policy
            </a>
            <div className="relative">
              <button
                className="text-white text-sm hover:text-gray-300 transition-colors"
                onMouseEnter={() => setShowSystemRequirements(true)}
                onMouseLeave={() => setShowSystemRequirements(false)}
              >
                System Requirements
              </button>
              {showSystemRequirements && (
                <div 
                  className="absolute bottom-full left-0 mb-4 bg-white text-gray-800 p-4 rounded-lg shadow-lg z-[10002] w-80 h-56"
                  onMouseEnter={() => setShowSystemRequirements(true)}
                  onMouseLeave={() => setShowSystemRequirements(false)}
                >
                  <strong className="text-[#014880] block mb-2 text-sm">Client System Requirements</strong>
                  <hr className="border-gray-300 " />
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left">Browser</th>
                        <th className="text-left">Version</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Google Chrome</td>
                        <td>45+</td>
                      </tr>
                      <tr>
                        <td>Mozilla Firefox</td>
                        <td>30+</td>
                      </tr>
                      <tr>
                        <td>Internet Explorer</td>
                        <td>10+</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-sm mt-2">
                    *Best viewed with Desktop and Tablet.<br />
                    Minimum screen resolution 1024x768
                  </p>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                className="text-white text-sm mt-2 hover:text-gray-200 transition-colors mb-2"
                onMouseEnter={() => setShowContactDetails(true)}
                onMouseLeave={() => setShowContactDetails(false)}
              >
                Contact Details
              </button>
              {showContactDetails && (
                <div 
                  className="absolute bottom-full left-0 mb-4 bg-white text-gray-800 p-4 rounded-lg shadow-lg z-[10002] w-80"
                  onMouseEnter={() => setShowContactDetails(true)}
                  onMouseLeave={() => setShowContactDetails(false)}
                >
                  <strong className="text-[#014880] block mb-2 text-sm">Contact Information</strong>
                  <hr className="border-gray-300 mb-3" />
                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Address:</span>
                      <span>Oxford University Press India, <br />
                      World Trade Tower, 12th Floor, <br />  
                      C-1, Sec-16, Main DND Road, Rajnigandha Chowk, Nodia -201301</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Email:</span>
                      <span>digitalhelp.in@oup.com</span>
                    </div>
                   
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Toll Free:</span> 1800-4190-901,<br />
                    </div>
                     <span>(9:00 AM - 6:00 PM from Monday to Saturday)</span>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Social Icons and Copyright - Right aligned */}
          <div className="flex items-center gap-4 md:gap-6 lg:gap-8 xl:gap-12">
            {/* Version and Copyright */}
            <div className="text-sm text-white whitespace-nowrap">
              <div className="flex justify-end w-full">V: 1.0.0</div>
              <div>© Oxford University Press | All rights reserved</div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/OUPIndia"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#1877F2] transition-all duration-300 transform hover:scale-105"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-[#002147] group-hover:text-white transition-colors duration-300" />
              </a>
              <a
                href="https://www.youtube.com/@OUPIndia"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#FF0000] transition-all duration-300 transform hover:scale-105"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-[#002147] group-hover:text-white transition-colors duration-300" />
              </a>
              <a
                href="https://www.instagram.com/oxforduniversitypressin/"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 transition-all duration-300 transform hover:scale-105"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-[#002147] group-hover:text-white transition-colors duration-300" />
              </a>
              <a
                href="https://www.linkedin.com/company/oxford-university-press-india/"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#0A66C2] transition-all duration-300 transform hover:scale-105"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-[#002147] group-hover:text-white transition-colors duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

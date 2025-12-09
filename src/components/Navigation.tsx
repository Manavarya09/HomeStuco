// Author: Manav Arya & Ashmit Dhown
import { Link, useLocation } from "react-router-dom";
// ...existing code...
import { useTranslation } from "react-i18next";
import React from "react";
import { throttle } from "../lib/throttle";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "HOME", to: "/" },
  { name: "EVENTS", to: "/events" },
  { name: "MERCH", to: "/merch" },
  { name: "CLUBS", to: "/CLUBS" },
  { name: "ABOUT", to: "/about" },
  { name: "CONTACT", to: "/contact" },
   { name: "EMC", to: "/EMC" },
  { name: "BSF", external: true, to: "https://bsf.bitsdubaievents.com" },
  { name: "JASHN26", to: "/jashn26" },
];

const Navigation = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { t } = useTranslation();
  
  // Force removal of any language switcher from DOM
  React.useEffect(() => {
    // Remove any lingering language switchers
    const removeLanguageSwitchers = () => {
      const possibleSwitchers = document.querySelectorAll('[style*="position: absolute"][style*="top: 10"][style*="right: 20"]');
      possibleSwitchers.forEach(el => {
        if (el.innerHTML.includes('EN') || el.innerHTML.includes('العربية')) {
          el.remove();
        }
      });
    };
    
    // Run on mount and whenever route changes
    removeLanguageSwitchers();
    
    // Create an observer to detect and remove any language switchers that might be added dynamically
    const observer = new MutationObserver(() => {
      removeLanguageSwitchers();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, [location]);

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  React.useEffect(() => {
    const handleScroll = throttle(() => {
      requestAnimationFrame(() => {
        const shouldBeScrolled = window.scrollY > 0;
        setScrolled(prev => (prev !== shouldBeScrolled ? shouldBeScrolled : prev));
      });
    }, 100); // Increased from 30ms to 100ms for better performance

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`w-full fixed top-0 left-0 z-50 px-8 pt-6 flex items-center transition-all duration-300 ease-out ${
          scrolled ? "bg-black/90 backdrop-blur-sm" : "bg-transparent"
        }`}
        style={{ willChange: 'transform' }}
      >

        <div className="flex-shrink-0">
          <Link to="/">
            <img 
              src="/assets/logo.webp" 
              alt="Logo" 
              className="h-20 w-auto object-contain cursor-pointer" 
              loading="lazy" 
            />
          </Link>
        </div>


        <div className="flex-1 flex justify-center">
          <ul className="hidden md:flex items-center justify-evenly w-[70%] text-white font-semibold text-xl tracking-wide navbar-optimized">
            {React.useMemo(() => navLinks.map((link, idx) => (
              <React.Fragment key={link.name}>
                <li>
                  {link.external ? (
                    <a
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whitespace-nowrap transition-colors duration-200 hover:text-red-300"
                      aria-label={t(link.name)}
                    >
                      {t(link.name)}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className={`whitespace-nowrap transition-colors duration-200 ${
                        location.pathname === link.to
                          ? "border-b-2 border-white"
                          : "hover:text-red-300"
                      }`}
                      aria-label={t(link.name)}
                    >
                      {t(link.name)}
                    </Link>
                  )}
                </li>
                {idx < navLinks.length - 1 && (
                  <span className="h-6 w-px bg-white/40" />
                )}
              </React.Fragment>
            )), [location.pathname, t])}
          </ul>
        </div>


        <div className="md:hidden ml-auto">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            aria-label="Open mobile menu"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </nav>


      {mobileMenuOpen && (
        <>

          <div
            className="fixed inset-0 bg-black/50 z-[998] transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          

          <div
            className={`fixed top-0 right-0 h-full w-[85vw] max-w-[400px] z-[999] shadow-2xl transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{
              background: "linear-gradient(180deg, #000000 0%, #1a1a1a 30%, #4a1a1a 70%, #dc2626 100%)"
            }}
          >

            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img src="/assets/logo.webp" alt="Logo" className="w-10 h-10" />
                <span className="text-white text-lg font-bold">{t("studentCouncil")}</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                aria-label="Close mobile menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>


            <div className="px-6 py-4">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-left py-4 px-4 rounded-lg font-semibold text-lg transition-all duration-200 text-white hover:bg-white/10 hover:pl-6"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t(link.name)}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block w-full text-left py-4 px-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                          location.pathname === link.to
                            ? "bg-white text-black shadow-lg"
                            : "text-white hover:bg-white/10 hover:pl-6"
                        }`}
                      >
                        {t(link.name)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navigation;
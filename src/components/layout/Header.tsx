import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/ui/language-selector";
import NavDropdown from "@/components/ui/nav-dropdown";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();
  const navigationItems = useLocalizedNavigation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColorClass = "text-gray-800";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md ${
        isScrolled
          ? "py-3"
          : "py-5"
      }`}
    >
      <div className="px-8 flex items-center justify-between w-full">
        <Link 
          to="/" 
          onClick={(e) => {
            // If already on home page, just scroll to top
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // Otherwise, Link will navigate to home page
          }} 
          className="flex items-center space-x-2 cursor-pointer"
        >
          <img
            src="/images/logo/boh_logo.png"
            alt="BOH Concepts Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navigationItems.map((item) => (
            item.dropdown ? (
              <NavDropdown
                key={item.title}
                title={t(item.title)}
                items={item.dropdown.map(dropItem => ({ title: t(dropItem.title), href: dropItem.href }))}
                textColorClass={textColorClass}
              />
            ) : (
              <Link
                key={item.title}
                to={item.href}
                className={`${textColorClass} hover:text-primary transition-colors font-medium`}
              >
                {t(item.title)}
              </Link>
            )
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSelector />
          <Button
            asChild
            variant="outline"
            className="border-black text-black bg-transparent hover:bg-black/10"
          >
            <a
              href="https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=8d9ee166-cbd6-4856-812a-036cba2c60b6&ccId=19000101_000001&lang=en_US"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Join Our Team")}
            </a>
          </Button>
          <Button
            asChild
            className="bg-brand-orange hover:bg-brand-orange/90 text-white"
          >
            <Link to="/contact">{t("Partner With Us")}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`${textColorClass} md:hidden`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navigationItems.map((item) => (
                item.dropdown ? (
                  <NavDropdown
                    key={item.title}
                    title={t(item.title)}
                    items={item.dropdown.map(dropItem => ({ title: t(dropItem.title), href: dropItem.href }))}
                    isMobile
                    textColorClass={textColorClass}
                    onItemClick={() => setIsMobileMenuOpen(false)}
                  />
                ) : (
                  <Link
                    key={item.title}
                    to={item.href}
                    className={`block py-3 px-4 hover:bg-gray-100 hover:text-primary ${textColorClass}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t(item.title)}
                  </Link>
                )
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 bg-transparent w-full"
                >
                  <a
                    href="https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html?cid=8d9ee166-cbd6-4856-812a-036cba2c60b6&ccId=19000101_000001&lang=en_US"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Join Our Team")}
                  </a>
                </Button>
                <Button
                  asChild
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white w-full"
                >
                  <Link to="/contact">{t("Partner With Us")}</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

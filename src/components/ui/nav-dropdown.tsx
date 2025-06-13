import { FC, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavDropdownItem {
  title: string;
  href: string;
}

interface NavDropdownProps {
  title: string;
  items: NavDropdownItem[];
  isMobile?: boolean;
  onItemClick?: () => void;
  textColorClass?: string;
}

const NavDropdown: FC<NavDropdownProps> = ({ 
  title, 
  items, 
  isMobile = false,
  onItemClick,
  textColorClass = 'text-gray-800'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = () => {
    setIsOpen(false);
    if (onItemClick) onItemClick();
  };

  // Mobile dropdown
  if (isMobile) {
    return (
      <div className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full py-3 px-4 hover:bg-gray-100 ${textColorClass}`}
        >
          <span>{title}</span>
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-4"
            >
              {items.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className="block py-3 px-4 hover:bg-gray-100 text-gray-600 hover:text-primary"
                  onClick={handleItemClick}
                >
                  {item.title}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 ${textColorClass} hover:text-primary transition-colors font-medium`}
        {...(isOpen ? { 'aria-expanded': true } : { 'aria-expanded': false })}
        aria-haspopup="true"
      >
        <span>{title}</span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
          >
            {items.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                onClick={handleItemClick}
              >
                {item.title}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavDropdown;

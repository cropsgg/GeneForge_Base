'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ui/theme-toggle';
import { NavbarConnect } from './NavbarConnect';

const NavLink = ({ href, title }: { href: string; title: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link href={href} className="relative">
      <span className={`text-md transition-colors duration-300 ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'}`}>
        {title}
      </span>
      {isActive && (
        <motion.div 
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" 
          layoutId="navbar-underline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
};

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 w-full bg-background/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl text-primary">
              GENEForge
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <NavLink href="/" title="Home" />
              <NavLink href="/data" title="Data" />
              <NavLink href="/about" title="About" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NavbarConnect />
            <ThemeToggle />
            <div className="md:hidden flex items-center">
              {/* Mobile menu button - to be implemented if needed */}
              <button className="text-muted-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
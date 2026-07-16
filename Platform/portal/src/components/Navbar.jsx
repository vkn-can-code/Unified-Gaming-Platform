import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  
  // Close menus when clicking outside or navigating (simplified)
  React.useEffect(() => {
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Main Navbar */}
      <header className="bg-background/80 backdrop-blur-md flex justify-between items-center w-full px-4 md:px-8 h-16 z-[60] fixed top-0 border-b border-outline-variant shadow-[0_0_20px_rgba(233,196,0,0.15)]">
        
        {/* Left Section: Menu & Brand */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="text-primary hover:text-primary transition-colors duration-300 p-2 rounded-full hover:bg-primary/10"
          >
            <span className="material-symbols-outlined">{isSidebarOpen ? 'close' : 'menu'}</span>
          </button>
          
          <Link to="/" className="hidden md:block font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-widest text-center hover:drop-shadow-[0_0_10px_rgba(233,196,0,0.5)] transition-all">
            ARCANE REALM
          </Link>
        </div>

        {/* Center: Brand on Mobile or Search on Desktop */}
        <div className="flex flex-col items-center flex-grow md:hidden">
          <Link to="/" className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-widest text-center">
            ARCANE
          </Link>
        </div>

        <div className="hidden md:flex flex-grow justify-center max-w-md px-4">
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
              search
            </span>
            <input 
              type="text" 
              placeholder="Search realms..." 
              className="w-full bg-surface-container/50 border border-outline-variant rounded-full py-2 pl-10 pr-4 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant"
            />
          </div>
        </div>

        {/* Right Section: Mobile Search Toggle, Notifications, Profile */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            className="md:hidden text-primary p-2 rounded-full hover:bg-primary/10"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <span className="material-symbols-outlined">search</span>
          </button>
          
          <button className="text-primary p-2 rounded-full hover:bg-primary/10 relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse"></span>
          </button>
          
          <div className="relative">
            <button 
              onClick={toggleProfile}
              className="text-primary hover:text-primary transition-colors duration-300 cursor-pointer focus:outline-none"
            >
              <img 
                alt="Profile" 
                className={`w-8 h-8 rounded-full border-2 transition-colors ${isProfileOpen ? 'border-primary' : 'border-primary/50'}`}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPIVKGbVJcM32FmTWPZgpJOoQfVpMLJquG-ChLo27ZRSc43pkVw_xZeiBYD8fVeL-_XMEm9iwOrWtbowu46LgDHEAfpnbv8PbmxS_dOPZVXJd7OfYYdOi63mxkyLtMfitAPGd0MGDB5LAPuyjVZoEoujSmsfTvsrLOcACng2tO63yZl7PgWd-_2FUSIYfIaDNDT6iOyxCmgfBoXbf4fuQRTRa2iAaLqLA6JFAqC1Oi-GNCnUCvjbZNpg"
              />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl glass-card border border-primary/20 shadow-xl overflow-hidden py-2"
                >
                  <div className="px-4 py-3 border-b border-outline-variant/50">
                    <p className="text-sm text-on-surface font-bold">Level 42 Wizard</p>
                    <p className="text-xs text-secondary mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                      1,250 Arcane Coins
                    </p>
                  </div>
                  <Link to="/" className="block px-4 py-2 text-sm text-on-surface hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">person</span> Profile
                  </Link>
                  <Link to="/" className="block px-4 py-2 text-sm text-on-surface hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">emoji_events</span> Achievements
                  </Link>
                  <div className="border-t border-outline-variant/50 my-1"></div>
                  <button className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 w-full bg-background border-b border-outline-variant p-4 z-[55] md:hidden shadow-lg"
          >
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                type="text" 
                autoFocus
                placeholder="Search realms..." 
                className="w-full bg-surface-container border border-outline-variant rounded-full py-2 pl-10 pr-4 text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[70]"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-72 bg-surface-container-high border-r border-primary/20 shadow-2xl z-[80] flex flex-col"
            >
              <div className="p-4 border-b border-primary/20 flex justify-between items-center bg-background/50">
                <span className="font-headline-lg-mobile text-primary tracking-widest">ARCANE</span>
                <button onClick={toggleSidebar} className="text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="flex-grow py-4 overflow-y-auto">
                <nav className="space-y-1 px-2">
                  <Link to="/" className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface hover:bg-primary/10 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">home</span>
                    <span className="font-medium">Home</span>
                  </Link>
                  <Link to="/library" className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface hover:bg-primary/10 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">stadia_controller</span>
                    <span className="font-medium">Game Library</span>
                  </Link>
                  <Link to="/" className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface hover:bg-primary/10 hover:text-primary transition-colors opacity-70">
                    <span className="material-symbols-outlined">leaderboard</span>
                    <span className="font-medium">Leaderboards</span>
                  </Link>
                  <Link to="/" className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface hover:bg-primary/10 hover:text-primary transition-colors opacity-70">
                    <span className="material-symbols-outlined">swords</span>
                    <span className="font-medium">Tournaments</span>
                  </Link>
                </nav>
              </div>
              
              <div className="p-4 border-t border-outline-variant/50">
                <button className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-on-surface hover:bg-primary/10 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">settings</span>
                  <span className="font-medium">Settings</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

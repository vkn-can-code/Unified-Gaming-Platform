import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function ComingSoon() {
  const location = useLocation();
  
  let title = "Coming Soon";
  if (location.pathname.includes('leaderboards')) title = "Leaderboards";
  if (location.pathname.includes('tournaments')) title = "Tournaments";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className="flex-grow pt-24 w-full max-w-[1200px] mx-auto px-4 md:px-12 pb-12 relative z-10 min-h-screen flex items-center justify-center"
    >
      <div className="glass-card w-full max-w-2xl p-12 rounded-3xl text-center relative overflow-hidden border border-primary/20">
        
        {/* Decorative background flare */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50 z-0"></div>

        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(233,196,0,0.2)] border border-primary/30"
          >
            <span className="material-symbols-outlined text-4xl text-primary drop-shadow-[0_0_5px_rgba(233,196,0,0.8)]">
              {location.pathname.includes('leaderboards') ? 'leaderboard' : 'swords'}
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-headline-lg text-4xl md:text-5xl text-primary mb-4"
          >
            {title}
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-on-surface-variant text-lg max-w-md mx-auto mb-10 leading-relaxed"
          >
            The Arcane Architects are currently forging this realm. Check back soon for legendary updates!
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link 
              to="/library"
              className="inline-block px-8 py-3 bg-secondary-container hover:bg-secondary text-on-secondary font-label-caps tracking-widest rounded transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,215,0,0.4)]"
            >
              Return to Library
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

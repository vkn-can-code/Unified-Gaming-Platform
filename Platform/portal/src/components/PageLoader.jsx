import React from 'react';
import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute w-32 h-32 rounded-full border-t-2 border-r-2 border-primary/50 shadow-[0_0_30px_rgba(233,196,0,0.4)]"
        ></motion.div>
        
        {/* Inner reverse spinning ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute w-24 h-24 rounded-full border-b-2 border-l-2 border-secondary/70 shadow-[0_0_20px_rgba(255,107,107,0.3)]"
        ></motion.div>
        
        {/* Core pulsing orb */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-12 h-12 rounded-full bg-primary shadow-[0_0_40px_rgba(233,196,0,0.8)]"
        ></motion.div>
      </div>
      
      <motion.h2 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="mt-12 font-headline-lg text-headline-lg text-primary tracking-widest uppercase drop-shadow-[0_0_10px_rgba(233,196,0,0.6)]"
      >
        Summoning Realm
      </motion.h2>
    </motion.div>
  );
}

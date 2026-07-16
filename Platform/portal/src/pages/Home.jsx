import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex-grow pt-16 w-full max-w-[1600px] mx-auto px-margin-mobile md:px-12 pb-12 relative z-10"
    >
      {/* Hero Section */}
      <section className="relative w-full h-[530px] md:h-[618px] rounded-xl overflow-hidden mt-8 glass-card border-primary/30 flex items-center justify-center text-center p-8">
        <div className="absolute inset-0 bg-cover bg-center w-full h-full opacity-40 mix-blend-screen" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRo2r92iM7PnD8hcVX-5Y7yRi2OTWbXWEk5SWLFjPMR1akWiKQ2UngHzMv49QmUkC8uNMv7uvmK5uKWRBgq6y-nctUOEqvVL4m8TGzs2_SxJ6wUI97pTxx6h7gPWQ1nB8EjCZNRr10o5j18xec4vEcZcjsKwTpbp_41yBR9w4nPhjTloH12vy5WhABSdfK62XniTWjVH1RyNhWqsiYyuuuqH8w1PV_Rju_gwvT2AD1bpA5KZhUh2Q5bg')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-0"></div>
        <div className="relative z-10 space-y-6 max-w-2xl">
          <div className="inline-block px-4 py-1 bg-secondary-container/20 border border-secondary rounded-sm font-label-caps text-label-caps text-secondary mb-4">
            UNIFIED ENGINE ACTIVE
          </div>
          <h2 className="font-display-hero text-display-hero text-primary drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            Welcome to Arcane Realm
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
            Discover dynamic games, conquer leaderboards, and experience seamless hosting in our premium unified game platform.
          </p>
          <div className="pt-6">
            <Link 
              to="/library"
              className="inline-block bg-primary-container text-on-primary font-headline-lg-mobile text-headline-lg-mobile py-3 px-8 rounded-sm hover:shadow-[0_0_20px_rgba(233,196,0,0.4)] transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Games
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

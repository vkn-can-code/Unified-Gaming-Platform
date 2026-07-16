import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CreatorSignature from '../components/CreatorSignature';

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

      {/* Live Stats Module */}
      <section className="mt-12 mb-16 px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 text-center border border-primary/20 hover:border-primary/50 transition-colors">
            <h4 className="text-secondary text-sm font-label-caps uppercase tracking-widest mb-2">Active Players</h4>
            <div className="text-4xl font-headline-lg text-primary drop-shadow-[0_0_10px_rgba(233,196,0,0.4)]">
              1,204
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center border border-primary/20 hover:border-primary/50 transition-colors">
            <h4 className="text-secondary text-sm font-label-caps uppercase tracking-widest mb-2">Realms Hosted</h4>
            <div className="text-4xl font-headline-lg text-primary drop-shadow-[0_0_10px_rgba(233,196,0,0.4)]">
              42
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center border border-primary/20 hover:border-primary/50 transition-colors">
            <h4 className="text-secondary text-sm font-label-caps uppercase tracking-widest mb-2">Total Matches</h4>
            <div className="text-4xl font-headline-lg text-primary drop-shadow-[0_0_10px_rgba(233,196,0,0.4)]">
              89,530
            </div>
          </div>
        </div>
      </section>

      {/* Features Module */}
      <section className="py-16 relative">
        <div className="text-center mb-12">
          <h3 className="font-headline-lg text-3xl md:text-4xl text-primary mb-4">Why Arcane Realm?</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-3xl border border-outline-variant hover:border-primary/40 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-3xl text-primary">bolt</span>
            </div>
            <h4 className="text-xl font-bold text-on-surface mb-3">Zero-Latency Routing</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Experience flawless gameplay with our edge-optimized infrastructure, ensuring every move is registered instantly.
            </p>
          </div>
          
          <div className="glass-card p-8 rounded-3xl border border-outline-variant hover:border-primary/40 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
              <span className="material-symbols-outlined text-3xl text-secondary">dns</span>
            </div>
            <h4 className="text-xl font-bold text-on-surface mb-3">Load-Balanced Queues</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Our intelligent queue system manages traffic spikes gracefully, maintaining server stability across all realms.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-outline-variant hover:border-primary/40 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-3xl text-primary">hub</span>
            </div>
            <h4 className="text-xl font-bold text-on-surface mb-3">Unified Ecosystem</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              One account to rule them all. Access your wallet, track achievements, and play instantly without multiple logins.
            </p>
          </div>
        </div>
      </section>

      {/* Signature Footer */}
      <CreatorSignature />
    </motion.div>
  );
}

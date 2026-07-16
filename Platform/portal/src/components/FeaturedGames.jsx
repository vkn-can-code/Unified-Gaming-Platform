import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameCard from './GameCard';
import { Link } from 'react-router-dom';

export default function FeaturedGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/games');
      if (response.ok) {
        const data = await response.json();
        // Just take the first 3 games for the featured section
        setGames((data.games || []).slice(0, 3));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || games.length === 0) return null;

  return (
    <section className="py-16 relative">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 px-4 md:px-0">
        <div>
          <h3 className="font-headline-lg text-3xl md:text-4xl text-primary mb-2">Trending Realms</h3>
          <p className="text-on-surface-variant">Jump straight into the most popular worlds.</p>
        </div>
        <Link 
          to="/library" 
          className="text-secondary hover:text-primary transition-colors flex items-center gap-2 mt-4 md:mt-0 font-medium"
        >
          View All Realms <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
        {games.map((game, index) => (
          <motion.div 
            key={game.id} 
            className="h-[250px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <GameCard game={game} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

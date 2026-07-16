import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameCard from '../components/GameCard';

export default function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/games');
      if (!response.ok) throw new Error('Failed to fetch games');
      const data = await response.json();
      setGames(data.games || []);
    } catch (err) {
      console.error(err);
      setError('The magic failed. Could not load games.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className="flex-grow pt-24 w-full max-w-[1600px] mx-auto px-margin-mobile md:px-12 pb-12 relative z-10 min-h-screen"
    >
      <section className="space-y-6">
        <div className="flex items-center space-x-4 mb-8">
          <h2 className="font-headline-lg text-headline-lg text-primary">Platform Library</h2>
          <div className="ethereal-divider flex-grow"></div>
        </div>
        
        {loading && (
          <div className="text-center font-headline-lg text-primary animate-pulse py-12">
            Summoning Realms...
          </div>
        )}

        {error && (
          <div className="text-center font-body-md text-error py-12 flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl mb-4">error</span>
            <p>{error}</p>
            <button onClick={fetchGames} className="mt-4 px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-on-primary transition-colors">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && games.length === 0 && (
          <div className="text-center font-headline-lg text-primary animate-pulse py-12">
            No realms discovered.
          </div>
        )}

        {!loading && !error && games.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
            {games.map((game, index) => (
              <motion.div 
                key={game.id} 
                className={index === 0 && games.length > 1 ? "md:col-span-2" : ""}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <GameCard game={game} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}

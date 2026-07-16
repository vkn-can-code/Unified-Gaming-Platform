import React, { useState, useEffect } from 'react';
import GameCard from './components/GameCard';
import GameOverlay from './components/GameOverlay';

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeGameUrl, setActiveGameUrl] = useState(null);
  const [activeGameTitle, setActiveGameTitle] = useState('');

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
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

  const handleLaunchGame = (name, url) => {
    setActiveGameTitle(name.replace(/-/g, ' '));
    setActiveGameUrl(url);
  };

  const handleCloseGame = () => {
    setActiveGameUrl(null);
    setActiveGameTitle('');
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pb-safe pb-24 md:pb-0 relative overflow-x-hidden">
      {/* Ethereal Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary-container/10 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary-container/5 blur-[120px]"></div>
      </div>

      {/* TopAppBar */}
      <header className="bg-background/80 backdrop-blur-md flex justify-between items-center w-full px-margin-mobile h-16 z-50 fixed border-b border-outline-variant shadow-[0_0_20px_rgba(233,196,0,0.15)]">
        <button className="text-primary hover:text-primary transition-colors duration-300">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex flex-col items-center flex-grow">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-widest text-center">
            ARCANE REALM
          </h1>
        </div>
        <div className="text-primary hover:text-primary transition-colors duration-300 cursor-pointer">
          <img 
            alt="Gilded User Profile" 
            className="w-8 h-8 rounded-full border border-primary/50" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPIVKGbVJcM32FmTWPZgpJOoQfVpMLJquG-ChLo27ZRSc43pkVw_xZeiBYD8fVeL-_XMEm9iwOrWtbowu46LgDHEAfpnbv8PbmxS_dOPZVXJd7OfYYdOi63mxkyLtMfitAPGd0MGDB5LAPuyjVZoEoujSmsfTvsrLOcACng2tO63yZl7PgWd-_2FUSIYfIaDNDT6iOyxCmgfBoXbf4fuQRTRa2iAaLqLA6JFAqC1Oi-GNCnUCvjbZNpg"
          />
        </div>
      </header>

      {/* Main Content Canvas - Full Width Without Sidebar */}
      <main className="flex-grow pt-16 w-full max-w-[1600px] mx-auto px-margin-mobile md:px-12 space-y-12 pb-12 relative z-10">
        
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
              <button 
                onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
                className="bg-primary-container text-on-primary font-headline-lg-mobile text-headline-lg-mobile py-3 px-8 rounded-sm hover:shadow-[0_0_20px_rgba(233,196,0,0.4)] transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore Games
              </button>
            </div>
          </div>
        </section>

        {/* Trending Realms (Games Grid) */}
        <section className="space-y-6 pt-4">
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
            <div className="text-center font-body-md text-error py-12">
              {error}
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
                <div key={game.id} className={index === 0 && games.length > 1 ? "md:col-span-2" : ""}>
                  <GameCard game={game} onLaunch={handleLaunchGame} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Game Overlay (Iframe Launcher) */}
      {activeGameUrl && (
        <GameOverlay 
          gameUrl={activeGameUrl} 
          gameTitle={activeGameTitle} 
          onClose={handleCloseGame} 
        />
      )}
    </div>
  );
}

export default App;

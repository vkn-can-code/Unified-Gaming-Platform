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

      {/* Side Navigation (Desktop Only) */}
      <aside className="hidden md:flex bg-background h-full w-80 rounded-r-xl border-r border-outline-variant shadow-2xl shadow-secondary-container/20 fixed inset-y-0 left-0 z-[60] flex-col transition-all duration-200 ease-in-out pt-6">
        <div className="px-6 pb-6 border-b border-outline-variant/30 mb-4 flex items-center gap-4">
          <img 
            alt="High-Level Adventurer Avatar" 
            className="w-16 h-16 rounded-full border-2 border-primary" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKB55bujwS5a-XJRTsxKuGgmK_Z1pRVnjvdgF2_hqRLWlriUi5Tr6qFbv_gPh8i76uAyNlRDPd5O-DQ9LRYlK-KTsDqLgu5HvBDcqub_uuNSkCZscimjS0ReQnFb_kLFH3DQ2I2WdLrE4yFHbItsOF4NzEFz4qqCyfh781bYcZhXRhD2dHpFoccmrxy58nAev5LQoPTFgfvkpFqq2v4q8JUsCUZTZsQqpdobGHjFDt8iIgd95gPUSkrA"
          />
          <div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Hero of the Void</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">LVL 99 Paladin</p>
            <p className="font-label-caps text-label-caps text-secondary mt-1">Mana: 100%</p>
          </div>
        </div>
        <nav className="flex-grow flex flex-col gap-2 px-4 overflow-y-auto">
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg bg-surface-variant/40 text-primary transition-colors group cursor-pointer">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span className="font-body-md text-body-md">Featured Realms</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-surface-variant/40 text-on-surface-variant transition-colors group cursor-pointer">
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">assignment</span>
            <span className="font-body-md text-body-md">Quest Log</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-surface-variant/40 text-on-surface-variant transition-colors group cursor-pointer">
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">forum</span>
            <span className="font-body-md text-body-md">Guild Chat</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-surface-variant/40 text-on-surface-variant transition-colors group cursor-pointer">
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">storefront</span>
            <span className="font-body-md text-body-md">Arcane Store</span>
          </a>
          <div className="mt-auto mb-4 border-t border-outline-variant/30 pt-4">
            <a className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-surface-variant/40 text-on-surface-variant transition-colors group cursor-pointer">
              <span className="material-symbols-outlined group-hover:text-primary transition-colors">settings</span>
              <span className="font-body-md text-body-md">Settings</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-16 md:pl-80 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-12 pb-12 relative z-10">
        
        {/* Hero Section */}
        <section className="relative w-full h-[530px] md:h-[618px] rounded-xl overflow-hidden mt-8 glass-card border-primary/30 flex items-center justify-center text-center p-8">
          <div className="absolute inset-0 bg-cover bg-center w-full h-full opacity-40 mix-blend-screen" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRo2r92iM7PnD8hcVX-5Y7yRi2OTWbXWEk5SWLFjPMR1akWiKQ2UngHzMv49QmUkC8uNMv7uvmK5uKWRBgq6y-nctUOEqvVL4m8TGzs2_SxJ6wUI97pTxx6h7gPWQ1nB8EjCZNRr10o5j18xec4vEcZcjsKwTpbp_41yBR9w4nPhjTloH12vy5WhABSdfK62XniTWjVH1RyNhWqsiYyuuuqH8w1PV_Rju_gwvT2AD1bpA5KZhUh2Q5bg')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-0"></div>
          <div className="relative z-10 space-y-6 max-w-2xl">
            <div className="inline-block px-4 py-1 bg-secondary-container/20 border border-secondary rounded-sm font-label-caps text-label-caps text-secondary mb-4">
              NEW EXPANSION LIVE
            </div>
            <h2 className="font-display-hero text-display-hero text-primary drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              Enter the Void
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
              Discover ancient artifacts, conquer legendary beasts, and forge your legacy in the most immersive fantasy realm ever created.
            </p>
            <div className="pt-6">
              <button className="bg-primary-container text-on-primary font-headline-lg-mobile text-headline-lg-mobile py-3 px-8 rounded-sm hover:shadow-[0_0_20px_rgba(233,196,0,0.4)] transition-all duration-300 transform hover:-translate-y-1">
                Begin Journey
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter">
          <div className="glass-card p-6 text-center space-y-2 rounded-lg glow-purple transition-all border-secondary/20">
            <span className="material-symbols-outlined text-secondary text-4xl mb-2">group</span>
            <h3 className="font-display-hero text-display-hero text-primary text-3xl">2.4M</h3>
            <p className="font-label-caps text-label-caps text-on-surface-variant">Active Heroes</p>
          </div>
          <div className="glass-card p-6 text-center space-y-2 rounded-lg glow-effect transition-all border-primary/20">
            <span className="material-symbols-outlined text-primary text-4xl mb-2">swords</span>
            <h3 className="font-display-hero text-display-hero text-primary text-3xl">15M+</h3>
            <p className="font-label-caps text-label-caps text-on-surface-variant">Quests Completed</p>
          </div>
          <div className="glass-card p-6 text-center space-y-2 rounded-lg glow-purple transition-all border-secondary/20">
            <span className="material-symbols-outlined text-secondary text-4xl mb-2">auto_awesome</span>
            <h3 className="font-display-hero text-display-hero text-primary text-3xl">99</h3>
            <p className="font-label-caps text-label-caps text-on-surface-variant">Max Level</p>
          </div>
          <div className="glass-card p-6 text-center space-y-2 rounded-lg glow-effect transition-all border-primary/20">
            <span className="material-symbols-outlined text-primary text-4xl mb-2">storefront</span>
            <h3 className="font-display-hero text-display-hero text-primary text-3xl">500+</h3>
            <p className="font-label-caps text-label-caps text-on-surface-variant">Legendary Items</p>
          </div>
        </section>

        {/* Trending Realms (Games Grid) */}
        <section className="space-y-6">
          <div className="flex items-center space-x-4 mb-8">
            <h2 className="font-headline-lg text-headline-lg text-primary">Trending Realms</h2>
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

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden bg-surface-container-lowest/90 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 rounded-t-3xl border-t border-primary/20 shadow-[0_-10px_30px_rgba(119,1,208,0.3)] flex justify-around items-center h-20 px-margin-mobile pb-safe">
        <a className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(233,196,0,0.8)] transition-all duration-200 w-16 cursor-pointer">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-label-caps text-label-caps">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-secondary-fixed transition-all w-16 cursor-pointer">
          <span className="material-symbols-outlined mb-1">swords</span>
          <span className="font-label-caps text-label-caps">Library</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-secondary-fixed transition-all w-16 cursor-pointer">
          <span className="material-symbols-outlined mb-1">group</span>
          <span className="font-label-caps text-label-caps">Social</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-secondary-fixed transition-all w-16 cursor-pointer">
          <span className="material-symbols-outlined mb-1">account_circle</span>
          <span className="font-label-caps text-label-caps">Profile</span>
        </a>
      </nav>

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

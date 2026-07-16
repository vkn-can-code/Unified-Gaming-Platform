import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Library from './pages/Library';
import PageLoader from './components/PageLoader';

function AnimatedRoutes() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitioning, setTransitioning] = useState(false);

  // We manually control the loading screen during navigation
  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsNavigating(true);
      setTransitioning(true);
      // Wait for loader to fade in, then switch route
      setTimeout(() => {
        setDisplayLocation(location);
        setIsNavigating(false);
      }, 800);
    }
  }, [location, displayLocation.pathname]);

  return (
    <>
      <AnimatePresence>
        {isNavigating && <PageLoader />}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        <Routes location={displayLocation} key={displayLocation.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
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
            <Link to="/" className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-widest text-center hover:drop-shadow-[0_0_10px_rgba(233,196,0,0.5)] transition-all">
              ARCANE REALM
            </Link>
          </div>
          <div className="text-primary hover:text-primary transition-colors duration-300 cursor-pointer">
            <img 
              alt="Gilded User Profile" 
              className="w-8 h-8 rounded-full border border-primary/50" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPIVKGbVJcM32FmTWPZgpJOoQfVpMLJquG-ChLo27ZRSc43pkVw_xZeiBYD8fVeL-_XMEm9iwOrWtbowu46LgDHEAfpnbv8PbmxS_dOPZVXJd7OfYYdOi63mxkyLtMfitAPGd0MGDB5LAPuyjVZoEoujSmsfTvsrLOcACng2tO63yZl7PgWd-_2FUSIYfIaDNDT6iOyxCmgfBoXbf4fuQRTRa2iAaLqLA6JFAqC1Oi-GNCnUCvjbZNpg"
            />
          </div>
        </header>

        {/* Main Content Canvas */}
        <AnimatedRoutes />
        
      </div>
    </BrowserRouter>
  );
}

export default App;

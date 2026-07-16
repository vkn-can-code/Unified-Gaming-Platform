import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Library from './pages/Library';
import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';

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

        {/* Navbar */}
        <Navbar />

        {/* Main Content Canvas */}
        <AnimatedRoutes />
        
      </div>
    </BrowserRouter>
  );
}

export default App;

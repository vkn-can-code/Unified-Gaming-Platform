import React from 'react';

export default function GameOverlay({ gameUrl, gameTitle, onClose }) {
  if (!gameUrl) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col transition-opacity duration-500 opacity-100">
      <div className="h-16 bg-surface-container-low border-b border-outline-variant flex justify-between items-center px-8 shadow-[0_0_20px_rgba(233,196,0,0.15)] z-[70]">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-widest uppercase">{gameTitle}</h2>
        <button 
          onClick={onClose}
          className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-on-primary py-2 px-6 font-label-caps text-label-caps rounded-sm transition-colors uppercase"
        >
          Leave Realm
        </button>
      </div>
      <div className="flex-grow w-full relative">
        <iframe 
          src={gameUrl} 
          frameBorder="0" 
          className="w-full h-full border-none bg-black"
          title={gameTitle}
        ></iframe>
      </div>
    </div>
  );
}

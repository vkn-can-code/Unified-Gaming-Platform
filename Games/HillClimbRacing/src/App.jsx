import { useEffect, useRef, useState } from 'react';
import { initGame } from './game/engine';
import { Trophy, ChevronLeft, RefreshCw } from 'lucide-react';

function App() {
  const canvasRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameCleanupRef = useRef(null);

  useEffect(() => {
    if (distance > highScore) {
      setHighScore(distance);
    }
  }, [distance, highScore]);

  const startGame = () => {
    if (gameCleanupRef.current) {
      gameCleanupRef.current();
    }
    if (canvasRef.current) {
      gameCleanupRef.current = initGame(canvasRef.current, setDistance);
    }
  };

  useEffect(() => {
    startGame();
    return () => {
      if (gameCleanupRef.current) gameCleanupRef.current();
    };
  }, []);

  const handleGasDown = () => { window.isGasPressed = true; };
  const handleGasUp = () => { window.isGasPressed = false; };
  
  const handleBrakeDown = () => { window.isBrakePressed = true; };
  const handleBrakeUp = () => { window.isBrakePressed = false; };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#120a1f] select-none">
      {/* Game Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block" 
        style={{ pointerEvents: 'none' }}
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-8">
        
        {/* Top Bar */}
        <div className="flex justify-between items-start w-full">
          <a 
            href="/" 
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-[rgba(30,15,45,0.85)] border border-[#8a2be2]/50 text-[#8a2be2] rounded-lg hover:bg-[#8a2be2]/20 hover:text-[#ffd700] transition-all font-bold text-sm shadow-[0_4px_12px_rgba(138,43,226,0.2)]"
          >
            <ChevronLeft size={18} />
            <span>Back to Portal</span>
          </a>

          <div className="flex flex-col gap-2 items-end">
            <div className="pointer-events-auto bg-[rgba(30,15,45,0.85)] border border-[#ffd700]/50 px-6 py-3 rounded-lg shadow-[0_0_15px_rgba(255,215,0,0.2)] flex items-center gap-3">
              <span className="text-2xl font-black text-[#ffd700] tracking-widest">{distance}m</span>
            </div>
            {highScore > 0 && (
              <div className="flex items-center gap-2 text-sm text-[#ffd700]/70 font-bold bg-[rgba(30,15,45,0.85)] px-3 py-1 rounded-full border border-[#ffd700]/20">
                <Trophy size={14} />
                <span>Best: {highScore}m</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Controls */}
        <div className="flex justify-between items-end w-full pb-4 md:pb-8 pointer-events-auto">
          <button 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[rgba(30,15,45,0.85)] border-4 border-[#e64343]/50 text-[#e64343] font-black text-xl shadow-[0_0_20px_rgba(230,67,67,0.3)] active:scale-95 active:bg-[#e64343]/20 transition-all flex items-center justify-center"
            onPointerDown={handleBrakeDown}
            onPointerUp={handleBrakeUp}
            onPointerLeave={handleBrakeUp}
            onContextMenu={(e) => e.preventDefault()}
          >
            BRAKE
          </button>
          
          <button 
            className="pointer-events-auto w-12 h-12 rounded-full bg-[rgba(30,15,45,0.85)] border border-[#8a2be2]/50 text-[#8a2be2] flex items-center justify-center hover:bg-[#8a2be2]/20 hover:text-[#ffd700] transition-all shadow-[0_0_15px_rgba(138,43,226,0.3)] mb-4 active:scale-90"
            onClick={startGame}
            title="Restart Level"
          >
            <RefreshCw size={24} />
          </button>

          <button 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[rgba(30,15,45,0.85)] border-4 border-[#00a896]/50 text-[#00a896] font-black text-xl shadow-[0_0_20px_rgba(0,168,150,0.3)] active:scale-95 active:bg-[#00a896]/20 transition-all flex items-center justify-center"
            onPointerDown={handleGasDown}
            onPointerUp={handleGasUp}
            onPointerLeave={handleGasUp}
            onContextMenu={(e) => e.preventDefault()}
          >
            GAS
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

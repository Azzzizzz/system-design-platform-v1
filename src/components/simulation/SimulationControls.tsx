import { Play, Square, FastForward, RotateCcw } from "lucide-react";
import { useSimulation } from "../../hooks/useSimulation";

export function SimulationControls() {
  const { isPlaying, speed, togglePlay, setSpeed, reset } = useSimulation();

  return (
    <div className="flex items-center gap-2 p-2 bg-[#0A0A0A]/90 backdrop-blur-md rounded-lg border border-white/10 shadow-lg">
      <button
        onClick={togglePlay}
        className={`p-2 flex items-center justify-center rounded-md transition-colors ${isPlaying ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30' : 'bg-primary/20 text-primary hover:bg-primary/30'}`}
      >
        {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      <button
        onClick={reset}
        className="p-2 flex items-center justify-center rounded-md text-white/50 hover:text-white/90 hover:bg-white/5 transition-colors"
        title="Reset Simulation"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        onClick={() => setSpeed(speed === 1 ? 2 : 1)}
        className={`px-3 py-1.5 flex items-center gap-1.5 rounded-md text-xs font-semibold transition-colors ${speed === 2 ? 'bg-amber-500/20 text-amber-500' : 'text-white/50 hover:text-white/90 hover:bg-white/5'}`}
      >
        <FastForward className="w-3.5 h-3.5" />
        {speed}x
      </button>
    </div>
  );
}

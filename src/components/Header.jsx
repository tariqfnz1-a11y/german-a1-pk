import React from 'react';
import { useGame } from '../context/GameContext';
import { Languages, RefreshCw } from 'lucide-react';

const Header = ({ onToggleSubtitles, onReset }) => {
  const { state } = useGame();
  const subtitleMap = { urdu: '🇵🇰 اردو', english: '🇬🇧 English', none: '🔇 Off' };

  return (
    <header className="flex flex-wrap items-center justify-between p-4 bg-indigo-700 text-white shadow-lg rounded-b-2xl">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🇩🇪</span>
        <h1 className="text-lg font-bold">A1 Simulator</h1>
        <span className="text-xs bg-indigo-500 px-2 py-1 rounded-full">Pakistan</span>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="bg-indigo-800 px-3 py-1 rounded-full text-sm font-mono">
          ⭐ {state.score}
        </div>
        <button
          onClick={onToggleSubtitles}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-full text-sm transition"
          title="Toggle Subtitles"
        >
          <Languages size={16} />
          <span className="hidden sm:inline">{subtitleMap[state.subtitles]}</span>
        </button>
        <button
          onClick={onReset}
          className="bg-red-500 hover:bg-red-600 p-1.5 rounded-full transition"
          title="Restart"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;

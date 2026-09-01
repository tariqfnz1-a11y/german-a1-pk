import React from 'react';
import { Play } from 'lucide-react';

const StartScreen = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <div className="bg-white/10 backdrop-blur-sm p-10 rounded-3xl border border-white/20 shadow-2xl max-w-2xl">
        <div className="text-6xl mb-4">🇩🇪🇵🇰</div>
        <h1 className="text-4xl font-bold text-white mb-2">German A1</h1>
        <h2 className="text-2xl font-semibold text-indigo-200 mb-4">For Pakistani Learners</h2>
        <p className="text-gray-200 mb-6 text-lg leading-relaxed">
          Navigate real-life scenarios in Germany. <br />
          Learn formalities like <span className="font-bold text-yellow-300">'Aap' (Sie)</span> vs <span className="font-bold text-blue-300">'Tum' (du)</span>. <br />
          Practice with your voice and earn points!
        </p>
        <div className="flex flex-col gap-2 text-sm text-gray-300 mb-8">
          <span>🛬 Frankfurt Airport</span>
          <span>🍽️ Döner Shop (Coming soon)</span>
          <span>🏛️ Bürgeramt (Coming soon)</span>
        </div>
        <button
          onClick={onStart}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg hover:scale-105 transition-all flex items-center gap-3 mx-auto"
        >
          <Play fill="currentColor" size={24} /> Start Journey
        </button>
      </div>
    </div>
  );
};

export default StartScreen;

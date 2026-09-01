import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useSpeech } from '../hooks/useSpeech';
import { Volume2, Mic, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

const GameScreen = () => {
  const { state, dispatch } = useGame();
  const { speakGerman, isSpeaking, startListening, isListening } = useSpeech();
  const [feedback, setFeedback] = useState(null);

  const currentNode = state.scenarioData?.nodes?.[state.currentNodeId];
  const isFinish = currentNode?.is_finish || false;

  useEffect(() => {
    if (currentNode?.audio_text) {
      const timer = setTimeout(() => {
        speakGerman(currentNode.audio_text);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentNode, speakGerman]);

  const handleChoice = (option) => {
    setFeedback(null);

    if (option.correct) {
      dispatch({ type: 'UPDATE_SCORE', payload: 10 });
      setFeedback({ type: 'success', message: `✅ +10 Points! ${option.grammar_tip || ''}` });
      
      setTimeout(() => {
        dispatch({ type: 'SET_NODE', payload: option.next_node });
        setFeedback(null);
      }, 1200);
    } else {
      dispatch({ type: 'UPDATE_SCORE', payload: -5 });
      dispatch({ type: 'INCREMENT_WRONG' });
      setFeedback({ type: 'error', message: `❌ -5 Points. ${option.grammar_tip || 'Try again!'}` });
      
      setTimeout(() => {
        dispatch({ type: 'SET_NODE', payload: option.next_node });
        setFeedback(null);
      }, 1500);
    }
  };

  const handleMicTest = () => {
    if (!currentNode?.audio_text) return;
    
    startListening(currentNode.audio_text, (result) => {
      if (result.passed) {
        setFeedback({ 
          type: 'success', 
          message: `🎤 Great! Browser heard: "${result.transcript}" (${result.accuracy}% match). +5 Bonus!` 
        });
        dispatch({ type: 'UPDATE_SCORE', payload: 5 });
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback({ 
          type: 'error', 
          message: `🎤 Try again. Browser heard: "${result.transcript}". Keep practicing!` 
        });
        setTimeout(() => setFeedback(null), 3000);
      }
    });
  };

  if (!currentNode) {
    return <div className="text-white text-center p-10">Loading scenario...</div>;
  }

  const renderSubtitle = () => {
    if (state.subtitles === 'none') return null;
    const text = state.subtitles === 'urdu' ? currentNode.urdu_translation : currentNode.english_translation;
    if (!text) return null;
    return (
      <div className={`text-sm font-medium mt-1 px-4 py-1 rounded-full bg-black/30 backdrop-blur-sm inline-block ${state.subtitles === 'urdu' ? 'text-amber-200' : 'text-blue-200'}`}>
        {state.subtitles === 'urdu' ? '🇵🇰 ' : '🇬🇧 '}{text}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto p-4">
      <div className="bg-indigo-900/40 rounded-xl p-3 mb-3 text-sm text-indigo-200 border border-indigo-500/30 text-center">
        {state.scenarioData?.urdu_context}
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl flex-1 flex flex-col">
        <div className="flex items-start gap-4">
          <div className="bg-indigo-600 rounded-full w-16 h-16 flex items-center justify-center text-3xl flex-shrink-0 shadow-lg border-2 border-indigo-300">
            👮‍♂️
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-bold text-white">German Officer</span>
              <button 
                onClick={() => speakGerman(currentNode.audio_text)}
                disabled={isSpeaking}
                className={`p-1.5 rounded-full transition ${isSpeaking ? 'bg-indigo-500 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-500'} text-white`}
              >
                <Volume2 size={18} />
              </button>
              <button 
                onClick={handleMicTest}
                disabled={isListening}
                className={`p-1.5 rounded-full transition ${isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500'} text-white`}
              >
                {isListening ? <Loader2 size={18} className="animate-spin" /> : <Mic size={18} />}
              </button>
              {isSpeaking && <span className="text-xs text-indigo-300">🔊 Speaking...</span>}
              {isListening && <span className="text-xs text-emerald-300">🎤 Listening...</span>}
            </div>
            
            <div className="bg-black/30 p-4 rounded-xl mb-2">
              <p className="text-white text-lg leading-relaxed">{currentNode.npc_text}</p>
              {renderSubtitle()}
            </div>

            {currentNode.grammar_tip && (
              <div className="bg-yellow-500/20 border border-yellow-400/40 p-2 rounded-lg text-sm text-yellow-200 flex items-start gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{currentNode.grammar_tip}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`mt-3 p-3 rounded-lg border flex items-center gap-3 transition-all ${
          feedback.type === 'success' ? 'bg-green-500/30 border-green-400 text-green-100' : 
          feedback.type === 'error' ? 'bg-red-500/30 border-red-400 text-red-100' : 
          'bg-blue-500/30 border-blue-400 text-blue-100'
        }`}>
          {feedback.type === 'success' && <CheckCircle size={20} />}
          {feedback.type === 'error' && <XCircle size={20} />}
          {feedback.type === 'info' && <AlertCircle size={20} />}
          <span className="text-sm">{feedback.message}</span>
        </div>
      )}

      {!isFinish && currentNode.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {currentNode.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleChoice(opt)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-xl text-left transition hover:scale-[1.02] focus:ring-2 focus:ring-indigo-400"
              disabled={!!feedback}
            >
              <span className="text-white font-medium">{opt.text}</span>
              <div className="text-xs text-gray-300 mt-1">
                {state.subtitles === 'urdu' && opt.urdu}
                {state.subtitles === 'english' && `(${opt.english})`}
              </div>
            </button>
          ))}
        </div>
      )}

      {isFinish && (
        <div className="mt-6 bg-gradient-to-r from-green-600/30 to-emerald-600/30 p-6 rounded-2xl border border-green-400/50 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-2xl font-bold text-white">Scenario Complete!</h3>
          <p className="text-gray-200 mt-1">{currentNode.npc_text}</p>
          <p className="text-yellow-300 mt-3 font-bold">Total Score: {state.score} ⭐</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2 rounded-full font-bold transition"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default GameScreen;

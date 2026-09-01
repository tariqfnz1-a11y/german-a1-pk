import React, { createContext, useReducer, useContext } from 'react';

const GameContext = createContext();

const initialState = {
  currentScenarioId: null,
  scenarioData: null,
  currentNodeId: null,
  score: 0,
  isFinished: false,
  subtitles: 'urdu',
  wrongAttempts: 0,
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_SCENARIO':
      return {
        ...state,
        currentScenarioId: action.payload.scenarioId,
        scenarioData: action.payload.data,
        currentNodeId: action.payload.data.initial_node || 'start',
        isFinished: false,
        wrongAttempts: 0,
      };
    case 'SET_NODE':
      return {
        ...state,
        currentNodeId: action.payload,
        isFinished: action.payload === 'finish' ? true : state.isFinished,
      };
    case 'UPDATE_SCORE':
      return {
        ...state,
        score: Math.max(0, state.score + action.payload),
      };
    case 'RESET_GAME':
      return { ...initialState };
    case 'TOGGLE_SUBTITLES':
      const modes = ['urdu', 'english', 'none'];
      const currentIndex = modes.indexOf(state.subtitles);
      const nextIndex = (currentIndex + 1) % modes.length;
      return { ...state, subtitles: modes[nextIndex] };
    case 'INCREMENT_WRONG':
      return { ...state, wrongAttempts: state.wrongAttempts + 1 };
    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

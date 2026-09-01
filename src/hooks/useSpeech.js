import { useState, useRef, useCallback } from 'react';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const speakGerman = useCallback((text) => {
    if (!window.speechSynthesis) {
      alert('Your browser does not support text-to-speech.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const startListening = useCallback((targetPhrase, onResult) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support the microphone. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript.toLowerCase().trim();
      const target = targetPhrase.toLowerCase().trim();
      const cleanResult = result.replace(/[.,!?]/g, '');
      const cleanTarget = target.replace(/[.,!?]/g, '');

      const targetWords = cleanTarget.split(' ');
      const matchCount = targetWords.filter(word => cleanResult.includes(word)).length;
      const accuracy = targetWords.length > 0 ? (matchCount / targetWords.length) * 100 : 0;
      const passed = accuracy >= 60;

      if (onResult) {
        onResult({
          transcript: result,
          passed: passed,
          accuracy: Math.min(100, Math.round(accuracy * 1.2))
        });
      }
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsListening(false);
      if (onResult) {
        onResult({
          transcript: '⚠️ Mic error. Please try again.',
          passed: false,
          accuracy: 0
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  }, []);

  return {
    speakGerman,
    isSpeaking,
    startListening,
    stopListening,
    isListening
  };
};

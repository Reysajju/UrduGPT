import { useCallback, useRef } from 'react';

export function useSound() {
  const sendAudioRef = useRef(new Audio('/sounds/send.mp3'));
  const receiveAudioRef = useRef(new Audio('/sounds/receive.mp3'));

  const playMessageSound = useCallback((type: 'send' | 'receive') => {
    try {
      const audio = type === 'send' ? sendAudioRef.current : receiveAudioRef.current;
      
      // Reset the audio to start
      audio.currentTime = 0;
      
      // Create and play a new audio context for iOS compatibility
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(audio);
      source.connect(audioContext.destination);
      
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch((error) => {
          console.warn('Audio playback failed:', error);
        });
      }
    } catch (error) {
      console.warn('Sound playback not supported:', error);
    }
  }, []);

  return { playMessageSound };
}
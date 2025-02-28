import React, { useRef, useState, useEffect } from 'react';
import { X, Mic, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
  onClose: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscript, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        stopRecording();
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError("Your browser doesn't support speech recognition.");
      setIsRecording(false);
      return;
    }
    
    // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    
    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      setTranscript(finalTranscript || interimTranscript);
    };
    
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setError(`Error: ${event.error}`);
      setIsRecording(false);
    };
    
    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };
    
    // Start recording
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Failed to start speech recognition', err);
      setError('Failed to start speech recognition');
      setIsRecording(false);
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping recognition', err);
      }
    }
    setIsRecording(false);
    
    if (transcript) {
      onTranscript(transcript);
    }
  };

  const handleSubmit = () => {
    stopRecording();
    if (transcript) {
      onTranscript(transcript);
    }
    onClose();
  };

  return (
    <div 
      ref={containerRef}
      className="absolute bottom-16 left-0 w-full max-w-xs mx-3 p-3 bg-background/95 backdrop-blur-md rounded-lg shadow-lg border border-urdu-accent/20 z-10"
      aria-label="Voice recorder"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Voice Input</h3>
        <button 
          onClick={() => {
            stopRecording();
            onClose();
          }}
          className="p-1 rounded-full hover:bg-secondary"
          aria-label="Close voice recorder"
        >
          <X size={16} />
        </button>
      </div>
      
      {error ? (
        <div className="text-red-500 text-sm mb-2">
          {error}
        </div>
      ) : (
        <div className="mb-3">
          <div className="flex justify-center mb-2">
            {isRecording ? (
              <div className="relative">
                <Mic size={40} className="text-urdu-accent animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-urdu-accent/20 animate-ping"></div>
              </div>
            ) : (
              <StopCircle size={40} className="text-muted-foreground" />
            )}
          </div>
          
          <div className="text-center text-sm">
            {isRecording ? "Listening..." : "Recording complete"}
          </div>
          
          {transcript && (
            <div className="mt-2 p-2 bg-secondary/50 rounded-md text-sm max-h-20 overflow-y-auto">
              {transcript}
            </div>
          )}
        </div>
      )}
      
      <div className="flex gap-2">
        {isRecording ? (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={stopRecording}
          >
            <StopCircle size={16} className="mr-1" />
            Stop
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              try {
                recognitionRef.current?.start();
                setIsRecording(true);
              } catch (err) {
                setError('Failed to restart recording');
              }
            }}
            disabled={!!error}
          >
            <Mic size={16} className="mr-1" />
            Restart
          </Button>
        )}
        
        <Button
          type="button"
          className="flex-1"
          onClick={handleSubmit}
          disabled={!transcript}
        >
          Use Text
        </Button>
      </div>
    </div>
  );
};

export default VoiceRecorder;